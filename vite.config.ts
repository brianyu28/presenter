import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "Presenter",
      formats: ["es", "umd"],
      fileName: (format) => `presenter.${format === "es" ? "mjs" : "js"}`,
    },
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: false,
  },
  plugins: [dts()],
});
