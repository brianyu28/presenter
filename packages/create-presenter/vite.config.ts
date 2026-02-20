import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["cjs"],
      fileName: () => "index.js",
    },
    outDir: "dist",
    target: "node18",
    rollupOptions: {
      external: [/^node:/, "path", "fs", "child_process", "readline"],
      output: {
        banner: "#!/usr/bin/env node",
      },
    },
  },
});
