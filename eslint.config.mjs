import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "coverage/**",
    "canvases/**",
    ".turbo/**",
    ".cache/**",
    "node_modules/**",
    "*.log",
    "next-env.d.ts",
    ".cursor/**",
    "scripts/**",
    "playwright-report/**",
    "test-results/**",
    "public/sw.js",
    "public/sw.template.js",
  ]),
  {
    files: ["e2e/**/*.ts"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
    },
  },
]);

export default eslintConfig;
