import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js, "simple-import-sort": simpleImportSort },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  globalIgnores(["dist/**", "packages/**", "webpack.config.js"]),
  tseslint.configs.recommended,
  {
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);
