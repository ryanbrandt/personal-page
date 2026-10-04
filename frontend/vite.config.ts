import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { deprecations } from "sass";

import { applyTheme, THEME_STORAGE_KEY } from "./src/common/utils/theme";
import {
  CONTACT_FIELDS,
  CONTACT_FORM_NAME,
  CONTACT_FORM_PATH,
  HONEYPOT_FIELD,
} from "./src/Contact/constants";

// Runs applyTheme from a script in index.html's <head>, ahead of the app's
// script and stylesheet, so the stored theme is set before the first paint.
const themeScript = (): Plugin => {
  const children = `(${applyTheme.toString()})(${JSON.stringify(THEME_STORAGE_KEY)});`;
  // Fail the build, not the browser, if the source stops being plain JS.
  new Function(children);
  return {
    name: "theme-script",
    transformIndexHtml: {
      order: "pre",
      handler: () => [{ tag: "script", children, injectTo: "head" }],
    },
  };
};

// Writes the static copy of the contact form that Netlify detects forms
// from at deploy time (the app renders its form with JavaScript, which
// Netlify doesn't run), from the same constants as the app's form.
const netlifyForms = (): Plugin => {
  const fields = [HONEYPOT_FIELD, ...CONTACT_FIELDS]
    .map((name) => `<input name="${name}" />`)
    .join("");
  const source = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="robots" content="noindex" />
    <title>Netlify Forms</title>
  </head>
  <body>
    <form name="${CONTACT_FORM_NAME}" data-netlify="true" netlify-honeypot="${HONEYPOT_FIELD}" hidden>${fields}</form>
  </body>
</html>
`;
  return {
    name: "netlify-forms",
    apply: "build",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: CONTACT_FORM_PATH.slice(1),
        source,
      });
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [themeScript(), netlifyForms(), react()],
  server: {
    open: true,
  },
  // Aliases (@app, @styles) come from `paths` in tsconfig.json. They only apply
  // to files matched by its `include`, which has no .scss files, so stylesheets
  // `@use` each other by relative path.
  resolve: {
    tsconfigPaths: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Every deprecation the installed Sass warns about fails the build.
        // The list follows the installed `sass` version, so a Sass bump that
        // adds a deprecation fails the build on purpose.
        fatalDeprecations: Object.values(deprecations).filter(
          (deprecation) => deprecation.status === "active"
        ),
      },
    },
  },
});
