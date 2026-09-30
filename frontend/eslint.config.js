// @ts-check
import { createRequire } from "node:module";

import js from "@eslint/js";
import prettier from "eslint-config-prettier/flat";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { importX } from "eslint-plugin-import-x";
import jsxA11y from "eslint-plugin-jsx-a11y-x";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { reactRefresh } from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

// eslint-plugin-react's `version: "detect"` calls an API that ESLint 10
// removed, so pass the installed React version ourselves.
const reactVersion = createRequire(import.meta.url)(
  "react/package.json"
).version;

export default defineConfig(
  globalIgnores(["dist/", "playwright-report/", "test-results/", ".yarn/"]),

  // Base rule sets for every linted file.
  js.configs.recommended,
  tseslint.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  {
    settings: {
      "import-x/resolver-next": [createTypeScriptImportResolver()],
    },
    rules: {
      curly: ["error", "multi-line"],
      // TypeScript already checks default imports.
      "import-x/default": "off",
      "import-x/no-named-as-default": "off",
      "import-x/no-named-as-default-member": "off",
      // Packages first, then our own `@app/*` modules.
      "import-x/order": [
        "error",
        {
          pathGroups: [
            { pattern: "@app/**", group: "external", position: "after" },
          ],
        },
      ],
    },
  },

  // Tooling files (configs, Playwright tests) run in Node.
  {
    files: ["*.config.{js,ts}", "e2e/**/*.ts"],
    languageOptions: { globals: globals.node },
  },

  // Application code: browser, React, type-aware rules.
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite(),
      jsxA11y.configs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: reactVersion },
    },
    rules: {
      // Components are arrow functions.
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      "react/jsx-max-depth": ["error", { max: 3 }],
      // Types replace prop-types.
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      // Import through the `@app/*` alias instead of relative paths.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^\\.{1,2}/",
              message: "Use the @app/* alias instead of a relative import.",
            },
          ],
        },
      ],
      // Known a11y debt: `<a onClick>` nav links and clickable divs are
      // replaced in P5 (NavLinks) and R2 (app shell), the work cards in R5,
      // and the résumé `<label>`s in R4. Restore "error" once those land.
      "jsx-a11y-x/anchor-is-valid": "warn",
      "jsx-a11y-x/click-events-have-key-events": "warn",
      "jsx-a11y-x/no-static-element-interactions": "warn",
      "jsx-a11y-x/label-has-associated-control": "warn",
    },
  },

  // Must stay last: turns off rules that conflict with Prettier.
  prettier
);
