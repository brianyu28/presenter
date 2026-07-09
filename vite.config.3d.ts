import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/3d/index.ts",
      name: "Presenter3D",
      formats: ["es", "umd"],
      fileName: (format) => `3d.${format === "es" ? "mjs" : "js"}`,
    },
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      external: ["three", "three/examples/jsm/loaders/GLTFLoader.js"],
      output: {
        globals: {
          three: "THREE",
          "three/examples/jsm/loaders/GLTFLoader.js": "THREE",
        },
      },
    },
  },
});
