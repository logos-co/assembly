import type { QuartzTransformerPlugin, BuildCtx } from "@quartz-community/types";

// This plugin has no options today; kept as a named type so the public API can
// grow without a breaking change.
export type TikzOptions = Record<string, never>;

// Base64-encode tikz source to survive HTML parsing without entity escaping
function toBase64(str: string): string {
  return Buffer.from(str, "utf-8").toString("base64");
}

// Expand icon SVG (same as mermaid uses)
const expandIconSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 1.06L2.56 7h10.88l-2.22-2.22a.75.75 0 011.06-1.06l3.5 3.5a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 11-1.06-1.06l2.22-2.22H2.56l2.22 2.22a.75.75 0 11-1.06 1.06l-3.5-3.5a.75.75 0 010-1.06l3.5-3.5z"></path></svg>`;

// Inline client-side script that renders tikz diagrams.
// Listens for the "nav" custom event (fired by Quartz SPA router on every
// navigation, including initial load) so diagrams render on SPA-navigated pages.
//
// After tikzjax renders each SVG, adds an expand button that opens a
// fullscreen pan-zoom modal (same pattern as mermaid diagrams).
const tikzInlineScript = `
document.addEventListener("nav", function() {
  var els = document.querySelectorAll("div[data-tikz-source]");
  if (els.length === 0) return;

  els.forEach(function(el) {
    var source = atob(el.getAttribute("data-tikz-source"));
    var script = document.createElement("script");
    script.type = "text/tikz";
    script.textContent = source;
    // Place script inside the container div so tikzjax replaces it
    // with an SVG that stays inside the container
    el.removeAttribute("data-tikz-source");
    el.appendChild(script);
  });

  // Ensure fonts CSS is loaded (idempotent — won't duplicate)
  if (!document.querySelector('link[href*="tikzjax.com"][rel="stylesheet"]')) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://tikzjax.com/v1/fonts.css";
    document.head.appendChild(link);
  }

  // Remove any existing tikzjax script so we can re-add it.
  // Re-adding triggers tikzjax to re-scan for <script type="text/tikz"> elements.
  var old = document.querySelector('script[src*="tikzjax.com"]');
  if (old) old.remove();

  var s = document.createElement("script");
  s.src = "https://tikzjax.com/v1/tikzjax.js";
  document.head.appendChild(s);

  // Watch for tikzjax to replace scripts with SVGs, then add expand buttons
  var containers = document.querySelectorAll(".tikzjax-container");
  containers.forEach(function(container) {
    var observer = new MutationObserver(function(mutations) {
      var svg = container.querySelector("svg");
      if (!svg) return;
      observer.disconnect();

      // Skip if expand button already added
      if (container.querySelector(".tikz-expand-btn")) return;

      // Add expand button
      var btn = document.createElement("button");
      btn.className = "tikz-expand-btn";
      btn.setAttribute("aria-label", "Expand TikZ diagram");
      btn.innerHTML = '${expandIconSvg}';
      container.appendChild(btn);

      // Add modal container
      var modal = document.createElement("div");
      modal.className = "tikz-modal";
      modal.setAttribute("role", "dialog");
      modal.innerHTML = '<div class="tikz-modal-space"><div class="tikz-modal-content"></div></div>';
      container.appendChild(modal);

      var panZoom = null;

      function showModal() {
        var content = modal.querySelector(".tikz-modal-content");
        while (content.firstChild) content.removeChild(content.firstChild);
        var clone = svg.cloneNode(true);
        content.appendChild(clone);
        modal.classList.add("active");
        modal.querySelector(".tikz-modal-space").style.cursor = "grab";

        // Simple pan-zoom
        var space = modal.querySelector(".tikz-modal-space");
        var isDragging = false, startX = 0, startY = 0, panX = 0, panY = 0, scale = 1;
        var clonedSvg = content.querySelector("svg");

        // Center initially
        panX = clonedSvg.getBoundingClientRect().width / 2;
        panY = clonedSvg.getBoundingClientRect().height / 2;
        content.style.transform = "translate(" + panX + "px," + panY + "px) scale(1)";

        function onMouseDown(e) {
          if (e.button !== 0) return;
          isDragging = true;
          startX = e.clientX - panX;
          startY = e.clientY - panY;
          space.style.cursor = "grabbing";
        }
        function onMouseMove(e) {
          if (!isDragging) return;
          e.preventDefault();
          panX = e.clientX - startX;
          panY = e.clientY - startY;
          content.style.transform = "translate(" + panX + "px," + panY + "px) scale(" + scale + ")";
        }
        function onMouseUp() {
          isDragging = false;
          space.style.cursor = "grab";
        }

        space.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);

        // Controls
        var controls = document.createElement("div");
        controls.className = "tikz-modal-controls";
        function makeBtn(text, fn) {
          var b = document.createElement("button");
          b.textContent = text;
          b.className = "tikz-modal-control-btn";
          b.addEventListener("click", fn);
          return b;
        }
        controls.appendChild(makeBtn("-", function() {
          scale = Math.max(0.5, scale - 0.1);
          content.style.transform = "translate(" + panX + "px," + panY + "px) scale(" + scale + ")";
        }));
        controls.appendChild(makeBtn("Reset", function() {
          scale = 1;
          panX = clonedSvg.getBoundingClientRect().width / 2;
          panY = clonedSvg.getBoundingClientRect().height / 2;
          content.style.transform = "translate(" + panX + "px," + panY + "px) scale(1)";
        }));
        controls.appendChild(makeBtn("+", function() {
          scale = Math.min(3, scale + 0.1);
          content.style.transform = "translate(" + panX + "px," + panY + "px) scale(" + scale + ")";
        }));
        space.appendChild(controls);

        panZoom = { cleanup: function() {
          space.removeEventListener("mousedown", onMouseDown);
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        }};
      }

      function hideModal() {
        modal.classList.remove("active");
        if (panZoom) { panZoom.cleanup(); panZoom = null; }
        // Remove controls so they're freshly created next time
        var c = modal.querySelector(".tikz-modal-controls");
        if (c) c.remove();
      }

      btn.addEventListener("click", showModal);

      // Close on backdrop click or Escape
      modal.addEventListener("click", function(e) {
        if (e.target === modal) { e.preventDefault(); hideModal(); }
      });
      document.addEventListener("keydown", function(e) {
        if (e.key.startsWith("Esc") && modal.classList.contains("active")) {
          e.preventDefault(); hideModal();
        }
      });
    });

    observer.observe(container, { childList: true, subtree: true });
  });
});
`;

// CSS for tikz container, expand button, and modal
const tikzCss = `
.tikzjax-wrapper {
  text-align: center;
  overflow-x: auto;
}

.tikzjax-container {
  position: relative;
  display: inline-block;
  background: #faf8f8;
  border-radius: 8px;
  padding: 1rem;
  color: #2b2b2b !important;
}

.tikzjax-container svg {
  max-width: 100%;
  height: auto;
}

.tikzjax-container svg text,
.tikz-modal-content svg text {
  fill: #2b2b2b !important;
  color: #2b2b2b !important;
}

.tikz-expand-btn {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  padding: 0.4rem;
  margin: 0.3rem;
  color: var(--gray);
  border-color: var(--dark);
  background-color: var(--light);
  border: 1px solid;
  border-radius: 5px;
  opacity: 0;
  transition: opacity 0.2s;
  cursor: pointer;
  z-index: 1;
}

.tikz-expand-btn > svg {
  fill: var(--light);
  filter: contrast(0.3);
}

.tikz-expand-btn:hover {
  border-color: var(--secondary);
}

.tikzjax-container:hover .tikz-expand-btn {
  opacity: 1;
}

.tikz-modal {
  position: fixed;
  contain: layout;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: none;
  backdrop-filter: blur(4px);
  background: rgba(0, 0, 0, 0.5);
}

.tikz-modal.active {
  display: inline-block;
}

.tikz-modal-space {
  border: 1px solid var(--lightgray);
  background-color: #faf8f8;
  border-radius: 5px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 80vh;
  width: 80vw;
  overflow: hidden;
}

.tikz-modal-content {
  padding: 2rem;
  position: relative;
  transform-origin: 0 0;
  transition: transform 0.1s ease;
  overflow: visible;
  min-height: 200px;
  min-width: 200px;
}

.tikz-modal-content svg {
  max-width: none;
  height: auto;
}

.tikz-modal-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  padding: 8px;
  background: #faf8f8;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.tikz-modal-control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid #e5e5e5;
  background: #faf8f8;
  color: #2b2b2b;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-family: var(--bodyFont);
  transition: all 0.2s ease;
}

.tikz-modal-control-btn:hover {
  background: #e5e5e5;
}

.tikz-modal-control-btn:active {
  transform: translateY(1px);
}

.tikz-modal-control-btn:nth-child(2) {
  width: auto;
  padding: 0 12px;
  font-size: 14px;
}
`;

export const Tikz: QuartzTransformerPlugin<TikzOptions> = () => {
  return {
    name: "Tikz",
    textTransform(_ctx: BuildCtx, src: string) {
      // Replace ```tikz ... ``` code blocks with a placeholder div containing
      // base64-encoded source. This avoids HTML entity escaping issues since
      // rehype-raw would escape characters like < inside script elements.
      const tikzBlockRegex = /^```tikz\n([\s\S]*?)^```$/gm;
      return src.replace(tikzBlockRegex, (_match: string, content: string) => {
        let source = content.trimEnd();

        // Wrap in \begin{document}...\end{document} if not already present,
        // matching obsidian-tikzjax convention
        if (!source.includes("\\begin{document}")) {
          source = `\\begin{document}\n${source}\n\\end{document}`;
        }

        const encoded = toBase64(source);
        return `<div class="tikzjax-wrapper"><div class="tikzjax-container" data-tikz-source="${encoded}"></div></div>`;
      });
    },
    externalResources() {
      return {
        css: [
          {
            content: tikzCss,
            inline: true,
          },
        ],
        js: [
          {
            script: tikzInlineScript,
            loadTime: "afterDOMReady",
            contentType: "inline",
          },
        ],
      };
    },
  };
};
