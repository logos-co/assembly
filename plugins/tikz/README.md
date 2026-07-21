# quartz-tikz

Render [TikZ](https://tikz.dev/) diagrams in [Quartz 5](https://quartz.jzhao.xyz)
via [TikZJax](https://tikzjax.com/). A `textTransform` rewrites fenced `tikz`
code blocks into a placeholder, and a small client script loads TikZJax from CDN
to render each diagram (with an expand → pan/zoom modal).

Ported from the v4 `quartz/plugins/transformers/tikz.ts` custom transformer.

## Usage

Write a fenced `tikz` block in any note:

````markdown
```tikz
\usepackage{tikz}
\begin{document}
\begin{tikzpicture}
  \draw (0,0) circle (1);
\end{tikzpicture}
\end{document}
```
````

The `\begin{document}…\end{document}` wrapper is added automatically if omitted
(obsidian-tikzjax convention).

## Install

Local (in this repo) via a relative source; published, like any community plugin:

```sh
npx quartz plugin add github:logos-co/quartz-tikz
```

## Configure

In `quartz.config.yaml`:

```yaml
plugins:
  - source: ./plugins/tikz # or github:logos-co/quartz-tikz
    enabled: true
    order: 15
```

No options. `order: 15` runs the `textTransform` early, before markdown parsing
touches the fenced block.

## How it works

- **Build time** — `textTransform` replaces ` ```tikz … ``` ` with
  `<div class="tikzjax-container" data-tikz-source="<base64>">`. Base64 avoids
  HTML entity escaping of TeX characters like `<`.
- **Client** — on Quartz's `nav` event, the inline script decodes each source
  into a `<script type="text/tikz">`, injects TikZJax from
  `tikzjax.com`, and TikZJax replaces the script with an SVG. An expand button
  opens a pan/zoom modal.

## Notes / limits

- Rendering depends on the third-party `tikzjax.com` CDN (JS + fonts).
- CSS and client JS are shipped as inline strings via `externalResources`, so
  this plugin needs no scss/`.inline.ts` build loaders.

## Build

```sh
npm install
npm run build      # tsup → dist/ (ESM + d.ts)
npm run typecheck
```
