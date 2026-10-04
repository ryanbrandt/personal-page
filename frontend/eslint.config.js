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

// eslint-plugin-react doesn't support ESLint 10 yet. Its `version: "detect"`
// calls an API ESLint 10 removed, so pass the installed React version
// ourselves. `react/jsx-filename-extension` and `react/forward-ref-uses-ref`
// hit removed APIs too; keep them off until the plugin supports ESLint 10.
const reactVersion = createRequire(import.meta.url)(
  "react/package.json"
).version;

// Import through the `@app/*` alias instead of relative paths, and use the
// typed Redux hooks.
const RESTRICTED_IMPORTS = {
  paths: [
    {
      name: "react-redux",
      importNames: ["useDispatch", "useSelector"],
      message: "Use useAppDispatch/useAppSelector from @app/store/hooks.",
    },
  ],
  patterns: [
    {
      regex: "^\\.{1,2}/",
      message: "Use the @app/* alias instead of a relative import.",
    },
  ],
};

// Only src/content reads the data files and the schemas: the app reads
// content through its hooks, and zod (the schemas) stays out of the bundle.
const CONTENT_DATA_IMPORTS = {
  regex: "^@app/content/(data|schemas)(/|$)",
  message:
    "Read content with the hooks in @app/content/hooks (types: @app/content/types).",
};

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
      // Function components only (replaces react-prefer-function-component).
      "no-restricted-syntax": [
        "error",
        {
          selector: "ClassDeclaration[superClass]",
          message: "Use a function component instead of a class.",
        },
      ],
      // Types replace prop-types.
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "no-restricted-imports": [
        "error",
        {
          ...RESTRICTED_IMPORTS,
          patterns: [...RESTRICTED_IMPORTS.patterns, CONTENT_DATA_IMPORTS],
        },
      ],
    },
  },
  {
    files: ["src/content/**"],
    rules: { "no-restricted-imports": ["error", RESTRICTED_IMPORTS] },
  },

  // Turns off rules that conflict with Prettier; keep it after the rule sets.
  prettier,

  // eslint-config-prettier disables `curly`, but "multi-line" is compatible
  // with Prettier, so re-enable it.
  { rules: { curly: ["error", "multi-line"] } }
);
