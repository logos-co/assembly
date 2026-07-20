# Inline Comments Worker

The one serverless piece behind Quartz [inline comments](../../docs-internal/inline-comments-design.md).
It does three things and holds the two secrets that can't live in the browser:

| Route                    | Purpose                                                                   |
| ------------------------ | ------------------------------------------------------------------------- |
| `GET /api/auth/login`    | Redirect to GitHub's OAuth authorize URL                                  |
| `GET /api/auth/callback` | Exchange `code` → user token, `postMessage` it back to the opener         |
| `GET /api/comments`      | Anonymous read proxy (server token) so logged-out visitors see highlights |

**Writes never touch this worker** — the browser posts comments straight to
GitHub's GraphQL API with the signed-in user's own token.

> **Order matters.** The OAuth App's callback URL must contain the worker's
> URL, and the worker's URL doesn't exist until it's deployed — so deploy
> first. Deploying without secrets is fine; those endpoints simply error until
> you add them.

## 1. Deploy the worker (Cloudflare Workers)

```sh
cd serverless/inline-comments-worker
npm install
npx wrangler login     # first run also prompts you to pick your workers.dev subdomain
npx wrangler deploy    # prints the URL
```

The printed URL is `https://<name>.<your-subdomain>.workers.dev`, where `<name>`
is `name` in `wrangler.toml`. For this repo it is:

```
https://inline-comments.inline-assembly.workers.dev
```

## 2. Create a GitHub OAuth App

<https://github.com/settings/developers> → **New OAuth App**

- **Homepage URL:** the site, `https://logos-co.github.io/assembly/`
- **Authorization callback URL:** the worker URL + `/api/auth/callback`, i.e.
  `https://inline-comments.inline-assembly.workers.dev/api/auth/callback`

Register, copy the **Client ID**, then **Generate a new client secret** and copy
it immediately (shown once).

An OAuth App allows only **one** callback URL, so register a **second app** for
local dev with callback `http://localhost:8787/api/auth/callback`.

> Scope requested is `public_repo` — enough to comment on Discussions of a
> public repo. For a stricter setup use a GitHub **App** with fine-grained
> Discussion write (a follow-up in the design doc).
>
> `logos-co` is an org: if it enforces third-party application restrictions, an
> owner must approve the app or posting will fail for members. Registering the
> app **under the org** (Org Settings → Developer settings → OAuth Apps) avoids
> tying ownership to one person's account.

## 3. Create the server read token

A **fine-grained PAT** (<https://github.com/settings/tokens?type=beta>) scoped to
`logos-co/assembly` with **Discussions: read**. This lets anonymous visitors load
existing comments. Store it as `GITHUB_TOKEN`.

## 4. Set secrets and origins

```sh
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
npx wrangler secret put GITHUB_TOKEN
```

Secrets apply immediately. `ALLOWED_ORIGINS` lives in `wrangler.toml` `[vars]`
and **requires a redeploy** to take effect:

```sh
npx wrangler deploy
```

### Local dev

```sh
cp .dev.vars.example .dev.vars   # fill in the three secrets (git-ignored)
npm run dev                      # serves on http://localhost:8787
```

`ALLOWED_ORIGINS` already includes `http://localhost:8080` (Quartz's dev server).

## 4. Point Quartz at the worker

In `quartz.layout.ts`:

```ts
Component.InlineComments({
  provider: "github",
  options: {
    repo: "logos-co/assembly",
    repoId: "R_kgDOQUhKqA",
    category: "Announcements",
    categoryId: "DIC_kwDOQUhKqM4Cxur2",
    apiBase: "https://inline-comments.<you>.workers.dev",
    mapping: "pathname",
  },
})
```

If `apiBase` is empty the component no-ops, so it's safe to land before the
worker exists.

## Notes / limits

- Comments + replies are fetched 100-at-a-time (no pagination yet).
- `mapping` must match on read and write. To share the _same_ discussion as the
  existing giscus widget, use the mapping giscus is configured with.
- Ports to Vercel/Netlify functions are straightforward — the handler is a
  single `fetch(request, env)`; only the deploy wrapper changes.
