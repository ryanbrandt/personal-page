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

// Use the typed Redux hooks.
const REDUX_HOOKS_IMPORT = {
  name: "react-redux",
  importNames: ["useDispatch", "useSelector"],
  message: "Use useAppDispatch/useAppSelector from @app/store/hooks.",
};

// Import through the `@app/*` alias instead of relative paths.
const RELATIVE_IMPORTS = {
  regex: "^\\.{1,2}/",
  message: "Use the @app/* alias instead of a relative import.",
};

// zod runs at build time (content/schemas.ts, from vite.config.ts) and in
// tests; keep it out of the app's bundle. Its types are fine.
const ZOD_IMPORT = {
  name: "zod",
  allowTypeImports: true,
  message: "zod is for the build-time content check (content/schemas.ts).",
};

// Only src/content reads the data files, the schemas and CONTENT: the app
// reads content through its hooks.
const CONTENT_MESSAGE =
  "Read content with the hooks in @app/content/hooks (types: @app/content/types).";
const CONTENT_FILE_IMPORTS = {
  regex: "^@app/content/(data|schemas)(\\.ts)?(/|$)",
  message: CONTENT_MESSAGE,
};
const CONTENT_DATA_IMPORTS = [
  "@app/content",
  "@app/content/index",
  "@app/content/index.ts",
].map((name) => ({ name, importNames: ["CONTENT"], message: CONTENT_MESSAGE }));

/**
 * The import rules, plus `paths` and `patterns`. typescript-eslint's version
 * of the rule, which can allow type-only imports.
 * @param {{ paths?: object[], patterns?: object[] }} [options]
 * @returns {import("eslint").Linter.RulesRecord}
 */
const restrictImports = ({ paths = [], patterns = [] } = {}) => ({
  "no-restricted-imports": "off",
  "@typescript-eslint/no-restricted-imports": [
    "error",
    {
      paths: [REDUX_HOOKS_IMPORT, ...paths],
      patterns: [RELATIVE_IMPORTS, ...patterns],
    },
  ],
});

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
      ...restrictImports({
        paths: [ZOD_IMPORT, ...CONTENT_DATA_IMPORTS],
        patterns: [CONTENT_FILE_IMPORTS],
      }),
    },
  },
  {
    files: ["src/content/**"],
    rules: restrictImports({ paths: [ZOD_IMPORT] }),
  },
  {
    files: ["src/content/schemas.ts", "src/**/*.test.ts"],
    rules: restrictImports(),
  },

  // Turns off rules that conflict with Prettier; keep it after the rule sets.
  prettier,

  // eslint-config-prettier disables `curly`, but "multi-line" is compatible
  // with Prettier, so re-enable it.
  { rules: { curly: ["error", "multi-line"] } }
);
