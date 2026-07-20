# Inline Comments for Quartz — Design

> Status: **draft / in progress**
> Owner: Corey Petty
> Companion code: `quartz/components/InlineComments.tsx`, `quartz/components/scripts/inlineComments.inline.ts`, `serverless/inline-comments-worker/`

## Goal

Add **inline, anchored comments** to this Quartz site — comments attached to a
specific text selection or paragraph (Medium margin-notes / Hypothes.is style),
not just one thread at the bottom of the page. It must be:

- **Portable** — a single drop-in Quartz component + one small serverless function.
- **Backed by GitHub Discussions** — same store as the existing page-bottom
  comments, so nothing is fragmented.
- **Authenticated with GitHub** — same identity model the site already uses.

## Starting point (what already exists)

`quartz.layout.ts` wires Quartz's built-in `Comments` component with
`provider: "giscus"`, pointed at GitHub Discussions on `logos-co/assembly`
(category _Announcements_). Giscus gives us **page-level** comments only:

- Auth + posting happen entirely inside Giscus's hosted `<iframe>`.
- One GitHub Discussion per page, mapped by URL.

**Constraint that drives everything below:** Giscus is a closed widget. It will
not hand our code the user's GitHub token, and it will not let us attach custom
anchor metadata to a comment. So we can _read_ a page's discussion and render any
comment that carries an anchor, but we cannot make Giscus _write_ an anchored
comment. Inline **writing** therefore requires our own GitHub auth.

We keep the existing Giscus widget. This system coexists with it on the **same
per-page Discussion** (see "Coexistence").

## Architecture overview

```
 ┌─────────────────────────── browser (static Quartz page) ───────────────────────────┐
 │  InlineComments.inline.ts                                                            │
 │   • anchoring engine (text-quote + text-position selectors)                          │
 │   • selection UI → floating "Comment" button → composer                              │
 │   • renders <mark> highlights + margin badges + thread popovers                      │
 │                                                                                      │
 │   reads (anon + authed) ───────────►  Worker /api/comments  ──► GitHub GraphQL       │
 │   login  ───────────────────────────► Worker /api/auth/login (302 → github.com)      │
 │   token exchange ◄──────────────────  Worker /api/auth/callback (postMessage token)  │
 │   writes (authed) ─────────────────────────────────────────►  GitHub GraphQL (user)  │
 └──────────────────────────────────────────────────────────────────────────────────────┘
```

The only non-static piece is the **Worker** (Cloudflare Workers / Vercel /
Netlify function). It holds the two secrets that can't live in the browser and
does four things:

1. `GET /api/auth/login` → redirect to GitHub's authorize URL (no `scope`; a
   GitHub App's permissions come from the App definition).
2. `GET /api/auth/callback` → exchange `code` (+ `client_secret`) for a user
   session; return a tiny HTML page that `postMessage`s it to the opener at the
   state-embedded origin, then closes.
3. `POST /api/auth/refresh` → exchange a refresh token for a fresh user token,
   so an expiring GitHub App token renews without a visible re-login.
4. `GET /api/comments` → **anonymous read proxy**. Uses a _server-side_ token so
   visitors who are not logged in can still see inline highlights. (Giscus solves
   the same problem behind its own backend; here we own it.)

**Writes** go from the browser straight to GitHub's GraphQL API using the
**user's own token** (`addDiscussionComment` / `addDiscussionCommentReply`). The
Worker never sees write traffic and never stores a user token. This keeps the
Worker tiny and minimizes the secret/trust surface.

## Anchoring

We use the **W3C Web Annotation** selector model (the same approach Hypothes.is
uses), which is robust to reflow and minor content edits:

- `TextQuoteSelector` — `{ exact, prefix, suffix }`. The selected text plus a
  short window of surrounding context. Primary anchor; survives DOM structure
  changes because it matches on text, not element paths.
- `TextPositionSelector` — `{ start, end }` character offsets into the article's
  normalized text. Fast path + disambiguation when the same `exact` string
  appears multiple times.
- `slug` — nearest heading id, coarse fallback / margin grouping.

**Anchoring root:** the article body, rendered by Quartz as
`<article class="popover-hint">` inside `.center`. We compute offsets over the
concatenated text nodes of that element only (sidebars/nav excluded).

**Re-anchoring on load:** find `exact` in the article text; if it occurs once,
done. If multiple, disambiguate with `prefix`/`suffix`, then `start/end`. Map the
resolved character range back to a DOM `Range` and wrap it in
`<mark class="inline-comment-highlight" data-comment-id="…">`.

**Orphans:** if `exact` can't be found (content changed too much), the comment is
_not_ lost — it is flagged `orphaned` and shown in a page-level fallback list
under the article. v1 uses exact + context matching; a later pass can swap in
`dom-anchor-text-quote` + `diff-match-patch` for fuzzy tolerance without changing
the stored format.

## Storage format

One GitHub Discussion per page (same URL→discussion mapping as Giscus, so the two
systems share a discussion). Each inline comment is a **top-level discussion
comment**; replies use `addDiscussionCommentReply`. The anchor rides along in the
comment body as an HTML comment — invisible in GitHub's rendered Discussion,
parseable by us:

```markdown
> the exact text the reader highlighted

The reader's actual comment prose.

<!-- quartz-anchor: {"v":1,"exact":"…","prefix":"…","suffix":"…","start":1234,"end":1290,"slug":"a-heading"} -->
```

- The `> quote` blockquote makes the comment self-explanatory on GitHub itself.
- The trailing `<!-- quartz-anchor: … -->` is the machine-readable anchor. We
  parse it out and strip it before rendering the body in the UI.
- Versioned (`"v":1`) so the format can evolve.

## Coexistence with Giscus

Because both systems use the same per-page Discussion:

- A comment **without** a `quartz-anchor` marker → a normal page-level comment,
  rendered by the existing Giscus widget at the bottom (unchanged).
- A comment **with** a marker → rendered inline by this plugin in the margin.

No migration, no data split. You can run both indefinitely, or later retire the
Giscus widget once the inline UI also renders unanchored comments as a bottom
list (the read proxy already returns them).

## Auth flow (detail)

Identity is a **GitHub App**, not an OAuth App. An OAuth App can only ask for
coarse scopes — the narrowest that permits commenting on a public repo's
Discussions is `public_repo`, which grants write access to _every_ public repo
the commenter owns. That's an unreasonable ask for a drive-by reader. A GitHub
App's permissions are fixed by the App definition, so a commenter grants exactly
**`Discussions: write` on `logos-co/assembly`** and nothing else.

1. User selects text, clicks "Comment", writes, hits submit while logged out.
2. Plugin opens a popup to `GET {apiBase}/api/auth/login?state=&origin=` with a
   random `state`.
3. Worker 302s to `https://github.com/login/oauth/authorize` with `client_id`
   and `state` — **no `scope`**, since the App defines its own permissions.
4. GitHub redirects back to `GET {apiBase}/api/auth/callback?code&state`.
5. Worker exchanges `code` + `client_secret`, returns HTML that
   `postMessage`s the session to the opener at the state-embedded origin.
6. Plugin stores the session in `localStorage` and retries the pending submit.

**Token lifetime.** GitHub Apps issue user-to-server tokens that expire (8h by
default) alongside a refresh token (~6 months). The client stores
`{ token, expiresAt, refreshToken, refreshExpiresAt }` and refreshes silently
through `POST {apiBase}/api/auth/refresh` (the worker holds the client secret)
with a 60s skew so a request can't expire mid-flight. If the App has expiration
disabled, GitHub omits those fields, `expiresAt` is `null`, and the token is
treated as non-expiring — both configurations work unchanged.

Trust model is the same as Giscus/utterances: the user posts **as themselves**
with their own token; the site never posts on their behalf.

The App must be **installed** on the repo by an org owner. This replaces the
OAuth App access-restriction approval that `logos-co` would otherwise enforce —
GitHub Apps are governed by installation, not by that policy.

## Component / config surface

`quartz.layout.ts`:

```ts
Component.InlineComments({
  provider: "github",
  options: {
    repo: "logos-co/assembly",
    repoId: "R_kgDOQUhKqA",
    category: "Announcements",
    categoryId: "DIC_kwDOQUhKqM4Cxur2",
    apiBase: "https://inline-comments.<you>.workers.dev", // the Worker
    mapping: "pathname", // how a page maps to a discussion term
  },
})
```

If `apiBase` is unset the client **no-ops gracefully** (site still builds and
renders; no inline UI). This keeps the component safe to land before the Worker
is deployed.

## Rate limits

- Authenticated GraphQL: 5000 points/hour/user — ample for writing.
- Anonymous reads go through the Worker's server token (also 5000/hr, shared).
  Mitigations if needed: short edge cache on `/api/comments`, and the client
  only fetches on pages where the component is present.

## Rollout phases

- **Phase 1 — anchoring + read-only render.** Ship the component, SCSS, and the
  anchoring/render engine. Reads come through the Worker's `/api/comments`.
  Proves the risky part (anchoring robustness) against real Discussion data.
- **Phase 2 — auth + write.** Login popup + composer + `addDiscussionComment`.
- **Phase 3 — threads + polish.** Replies, margin/gutter UX, orphan list,
  reactions, optional fuzzy re-anchoring.

## Alternatives considered

- **Hypothes.is embed** — inline annotations for free, no backend, but stores in
  Hypothes.is with its own identity. Fails "push to Discussions."
- **Read-only inline over Giscus** — no backend, but cannot write anchored
  comments. Incomplete alone.
- **Self-host giscus's backend** — full control, far more than needed.

## Open questions / follow-ups

- Server read token is still a fine-grained PAT (tied to a person). Deriving an
  installation access token from the App's private key would decouple it — needs
  JWT signing in the worker via Web Crypto.
- Whether to also render unanchored comments in-plugin and retire Giscus.
- Fuzzy re-anchoring library choice (`dom-anchor-text-quote` + `diff-match-patch`).
- Abuse/moderation: rely on GitHub Discussion moderation + repo permissions.
