import { defineConfig } from "tsup";

// This transformer ships its client JS and CSS as inline strings (see
// transformer.ts), so no scss/.inline.ts loaders are needed — a plain bundle.
export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm"],
  dts: true,
  tsconfig: "tsconfig.build.json",
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2022",
  platform: "node",
  noExternal: [/.*/],
  external: ["@jackyzha0/quartz", "@jackyzha0/quartz/*", "vfile", "vfile/*", "unified"],
  banner: {
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
  },
});
