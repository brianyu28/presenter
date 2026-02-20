import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/export/index.ts",
      name: "PresenterExport",
      formats: ["es", "umd"],
      fileName: (format) => `export.${format === "es" ? "mjs" : "js"}`,
    },
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: false,
    target: "node18",
    rollupOptions: {
      external: ["skia-canvas", "sharp", "fs", "node:fs", "path", "node:path", "node:https"],
      output: {
        globals: {
          "skia-canvas": "skia-canvas",
          sharp: "sharp",
          fs: "fs",
          "node:fs": "fs",
          path: "path",
          "node:path": "path",
          "node:https": "https",
        },
      },
    },
  },
});
