import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/export/browser.ts",
      name: "PresenterBrowserExport",
      formats: ["es", "umd"],
      fileName: (format) => `export-browser.${format === "es" ? "mjs" : "js"}`,
    },
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
  },
});
