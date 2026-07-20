# Migrating Inline Comments to a Standalone Quartz 5 Plugin

> Status: **planned**
> Prerequisite: the site is migrated to Quartz 5 (see [migrating](https://quartz.jzhao.xyz/getting-started/migrating))
> Companion: [inline-comments-design.md](./inline-comments-design.md)

## Why

In v4 this feature lives *inside* the site repo as a custom component
(`quartz/components/InlineComments.tsx` + inline script + SCSS), wired up by
hand in `quartz.layout.ts`. Porting it to another site means copying files,
which drifts.

Quartz 5 replaces that model: components are **standalone Git repositories**
installed with `npx quartz plugin add`. That is exactly the right shape for
this feature, and it turns "port it to another site" into one command.

## Findings: what actually changes

Verified against a real v5 community plugin
([`quartz-community/explorer`](https://github.com/quartz-community/explorer)),
not just the docs.

### Survives unchanged

- **The whole anchoring engine.** `inlineComments.inline.ts` is plain DOM/TS
  whose only external import is `@floating-ui/dom`.
- **Both SPA globals we depend on.** Confirmed present in v5 —
  `window.addCleanup(...)` and `document.addEventListener("nav", ...)` are both
  used by explorer's own inline script.
- **The component resource API.** `Component.css = style` and
  `Component.afterDOMLoaded = script` are identical in v5, as is
  `satisfies QuartzComponentConstructor`.
- **SCSS.** `tsup.config.ts` compiles `.scss` through `sass` and `.inline.ts`
  through a nested esbuild pass, both loaded as text — same mental model as v4.
- **The worker.** `serverless/inline-comments-worker/` needs **zero changes**;
  it is independent infrastructure that only speaks HTTP.

### Mechanical changes

| v4 | v5 |
| --- | --- |
| `import ... from "./types"` | `from "@quartz-community/types"` |
| `classNames` from `../util/lang` | `@quartz-community/utils/lang`, or vendor a local copy (explorer vendors its own) |
| `import script from "./scripts/x.inline"` | `"./scripts/x.inline.ts"` with `// @ts-expect-error` |
| Wiring in `quartz.layout.ts` | `quartz` manifest block in `package.json` |
| Options as a TS object | YAML `options:` validated by `optionSchema` |

> Do **not** import from `@jackyzha0/quartz` or `vfile` directly — the v5 plugin
> docs call this out explicitly. Use the `@quartz-community/*` packages.

## Target repo layout

Mirrors `quartz-community/explorer`:

```
quartz-inline-comments/
├── src/
│   ├── index.ts                       # export { default as InlineComments }
│   └── components/
│       ├── InlineComments.tsx
│       ├── scripts/inlineComments.inline.ts
│       └── styles/inlineComments.scss
├── types/globals.d.ts                 # addCleanup, CustomEventMap, *.scss module
├── package.json                       # deps + the `quartz` manifest block
├── tsup.config.ts                     # scss + .inline.ts esbuild loaders
├── tsconfig.json / tsconfig.build.json
└── README.md
```

### The manifest

Layout position lives in `package.json`, not in any layout file:

```jsonc
"quartz": {
  "name": "inline-comments",
  "displayName": "Inline Comments",
  "category": "component",
  "quartzVersion": ">=5.0.0",
  "defaultEnabled": true,
  "defaultOrder": 50,
  "components": {
    "InlineComments": {
      "displayName": "Inline Comments",
      "defaultPosition": "afterBody",
      "defaultPriority": 50
    }
  },
  "optionSchema": {
    "repo":       { "type": "string" },
    "repoId":     { "type": "string" },
    "category":   { "type": "string" },
    "categoryId": { "type": "string" },
    "apiBase":    { "type": "string" },
    "mapping":    { "type": "enum", "values": ["url", "pathname", "title"] }
  }
}
```

All existing options are plain strings, so they survive the move to YAML
unchanged — no option needs restructuring.

### Dependencies

```jsonc
"dependencies": {
  "@quartz-community/types": "github:quartz-community/types",
  "@quartz-community/utils": "github:quartz-community/utils"
},
"peerDependencies": { "preact": "^10.0.0" }
```

`@floating-ui/dom` becomes a real dependency of the plugin (in v4 we relied on
it being a stock Quartz dep — a plugin cannot assume that).

## Consumer experience

```sh
npx quartz plugin add github:logos-co/quartz-inline-comments
```

```yaml
plugins:
  - source: github:logos-co/quartz-inline-comments
    enabled: true
    options:
      repo: logos-co/assembly
      repoId: R_kgDOQUhKqA
      category: Announcements
      categoryId: DIC_kwDOQUhKqM4Cxur2
      apiBase: https://inline-comments.inline-assembly.workers.dev
      mapping: url
```

Any Quartz 5 site can then adopt this in one command. The worker can be shared
across sites (add the new origin to `ALLOWED_ORIGINS`, install the GitHub App on
the new repo, widen the read PAT) or deployed per-site.

## Open questions to resolve during the port

1. **Is the anchoring root still `<article class="popover-hint">`?**
   `getRoot()` depends on it. Explorer is a sidebar component so it tells us
   nothing here. This is the single highest-risk unknown; if the markup changed
   it is a one-line fix, but it must be checked on a running v5 site.
2. **Does `dist/` need to be committed?** Explorer commits its `dist/`, and
   `quartz plugin add` installs over git rather than npm, which implies built
   output must be present in the repo. Confirm on first install; if so, add a
   CI workflow that builds and commits `dist/` on release.
3. **Does `optionSchema` support required fields / defaults?** `repo`, `repoId`
   and `apiBase` have no sensible default; ideally the schema can mark them
   required rather than failing at runtime.
4. **Where should the repo live?** Under `logos-co`, or published to
   `quartz-community` so other Quartz sites can use it.

## Sequencing

1. Migrate the site to Quartz 5 on a branch (production stays on v4).
2. Build the plugin repo and validate against that branch.
3. `quartz plugin add` it, configure in `quartz.config.yaml`, verify end to end.
4. Cut production over.

The feature is offline between the moment `quartz.layout.ts` disappears and the
moment the plugin is installed — which is why the v5 work belongs on a branch.

## Carry-over checklist

Beyond the component itself, these must survive the v5 migration:

- [ ] `serverless/inline-comments-worker/` (unchanged, but must not be lost)
- [ ] `docs-internal/` (this file and the design doc)
- [ ] `.gitignore` rules protecting `.dev.vars` and `.wrangler/`
- [ ] Worker `ALLOWED_ORIGINS` still matches the production origin
- [ ] CI deploy workflow retargeted from `v4` to the new default branch
