# Inline Comments Worker

The one serverless piece behind Quartz [inline comments](../../docs-internal/inline-comments-design.md).
It does three things and holds the two secrets that can't live in the browser:

| Route                    | Purpose                                                                   |
| ------------------------ | ------------------------------------------------------------------------- |
| `GET /api/auth/login`    | Redirect to GitHub's authorize URL                                        |
| `GET /api/auth/callback` | Exchange `code` → user session, `postMessage` it back to the opener       |
| `POST /api/auth/refresh` | Exchange a refresh token for a fresh user token                           |
| `GET /api/comments`      | Anonymous read proxy (server token) so logged-out visitors see highlights |

**Writes never touch this worker** — the browser posts comments straight to
GitHub's GraphQL API with the signed-in user's own token.

Auth is a **GitHub App**, not an OAuth App. That matters: an OAuth App would
have to request the `public_repo` scope, which grants write access to _every_
public repo the commenter owns. A GitHub App's permissions are fixed by the App
definition, so commenters grant only **`Discussions: write` on this one repo**.
No `scope` is sent on the authorize URL as a result.

> **Order matters.** The App's callback URL must contain the worker's URL, and
> the worker's URL doesn't exist until it's deployed — so deploy first.
> Deploying without secrets is fine; those endpoints simply error until you
> add them.

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

## 2. Create a GitHub App

Create it **under the `logos-co` org** so ownership isn't tied to one person:

<https://github.com/organizations/logos-co/settings/apps> → **New GitHub App**

| Setting                                                    | Value                                                                   |
| ---------------------------------------------------------- | ----------------------------------------------------------------------- |
| **GitHub App name**                                        | `Assembly Inline Comments`                                              |
| **Homepage URL**                                           | `https://logos-co.github.io/assembly/`                                  |
| **Callback URL**                                           | `https://inline-comments.inline-assembly.workers.dev/api/auth/callback` |
| **Request user authorization (OAuth) during installation** | ✅ **check this**                                                       |
| **Expire user authorization tokens**                       | ✅ leave checked (see below)                                            |
| **Webhook → Active**                                       | ❌ uncheck — we don't use webhooks                                      |
| **Repository permissions → Discussions**                   | **Read and write**                                                      |
| **Where can this GitHub App be installed?**                | Only on this account                                                    |

Everything else can stay at its default. Then:

1. **Create GitHub App.**
2. Copy the **Client ID** (`Iv23li…`) and **Generate a new client secret** —
   copy it immediately, it's shown once.
3. **Install App** → install it on **`logos-co/assembly`** (choosing "Only
   select repositories" and picking just that repo). Without this install step
   the App can't touch the repo's Discussions.

Add a **second callback URL** on the same App for local dev —
`http://localhost:8787/api/auth/callback`. Unlike OAuth Apps, a GitHub App
accepts multiple callback URLs, so one App covers both prod and dev.

> **On token expiration.** With "Expire user authorization tokens" enabled,
> user tokens last 8 hours and come with a ~6-month refresh token; the client
> refreshes silently via `POST /api/auth/refresh`. If you disable expiration,
> GitHub omits those fields and the client treats the token as non-expiring —
> both paths work, so keep the secure default.
>
> A GitHub App is **not** subject to the org's OAuth App access restrictions;
> it's governed by installation instead. That's why the previous "org must
> approve the OAuth App" step is gone — installing it (step 3) is the
> equivalent, and an org owner does it once.

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

## 5. Point Quartz at the worker

In `quartz.layout.ts`:

```ts
Component.InlineComments({
  provider: "github",
  options: {
    repo: "logos-co/assembly",
    repoId: "R_kgDOQUhKqA",
    category: "Announcements",
    categoryId: "DIC_kwDOQUhKqM4Cxur2",
    apiBase: "https://inline-comments.inline-assembly.workers.dev",
    mapping: "url", // must match giscus's mapping to share a discussion
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
