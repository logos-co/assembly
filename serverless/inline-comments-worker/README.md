# Inline Comments Worker

The one serverless piece behind Quartz [inline comments](../../docs-internal/inline-comments-design.md).
It does three things and holds the two secrets that can't live in the browser:

| Route | Purpose |
|-------|---------|
| `GET /api/auth/login` | Redirect to GitHub's OAuth authorize URL |
| `GET /api/auth/callback` | Exchange `code` → user token, `postMessage` it back to the opener |
| `GET /api/comments` | Anonymous read proxy (server token) so logged-out visitors see highlights |

**Writes never touch this worker** — the browser posts comments straight to
GitHub's GraphQL API with the signed-in user's own token.

## 1. Create a GitHub OAuth App

<https://github.com/settings/developers> → **New OAuth App**

- **Homepage URL:** your site, e.g. `https://assembly.logos.co`
- **Authorization callback URL:** `https://<your-worker-domain>/api/auth/callback`

Copy the **Client ID** and generate a **Client secret**.

> Scope requested is `public_repo` — enough to comment on Discussions of a
> public repo. For a stricter setup use a GitHub **App** with fine-grained
> Discussion write (a follow-up in the design doc).

## 2. Create the server read token

A **fine-grained PAT** (<https://github.com/settings/tokens?type=beta>) with
**read** access to the repo's Discussions. This lets anonymous visitors load
existing comments. Store it as `GITHUB_TOKEN`.

## 3. Configure & deploy (Cloudflare Workers)

```sh
cd serverless/inline-comments-worker
npm install

# set the allowed site origin(s)
#   edit wrangler.toml → [vars] ALLOWED_ORIGINS = "https://assembly.logos.co"

# secrets
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
wrangler secret put GITHUB_TOKEN

wrangler deploy
```

Deploy prints the worker URL (e.g. `https://inline-comments.<you>.workers.dev`).

### Local dev

```sh
cp .dev.vars.example .dev.vars   # fill in the three secrets
npm run dev                      # serves on http://localhost:8787
```

Keep `ALLOWED_ORIGINS = "http://localhost:8080"` (Quartz's dev server) while testing.

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
- `mapping` must match on read and write. To share the *same* discussion as the
  existing giscus widget, use the mapping giscus is configured with.
- Ports to Vercel/Netlify functions are straightforward — the handler is a
  single `fetch(request, env)`; only the deploy wrapper changes.
