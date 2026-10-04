/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { deprecations } from "sass";
import { prettifyError } from "zod";

import { HOME_TITLE } from "./src/common/constants/site";
import { applyTheme, THEME_STORAGE_KEY } from "./src/common/utils/theme";
import education from "./src/content/data/education.json" with { type: "json" };
import experience from "./src/content/data/experience.json" with { type: "json" };
import projects from "./src/content/data/projects.json" with { type: "json" };
import skills from "./src/content/data/skills.json" with { type: "json" };
import { contentSchema } from "./src/content/schemas";

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

// The page's title until the app loads (and for clients that don't run it),
// so the site's name is written in one place.
const documentTitle = (): Plugin => ({
  name: "document-title",
  transformIndexHtml: {
    order: "pre",
    handler: () => [{ tag: "title", children: HOME_TITLE, injectTo: "head" }],
  },
});

// Checks content/data against content/schemas.ts as the build (or dev
// server) starts, so bad data fails the build (and so the deploy) instead
// of breaking the page. The checks run here, not in the app, to keep zod
// out of its bundle.
// TODO(images): make and measure the project images' variants here (see
// content/schemas.ts).
const contentCheck = (): Plugin => ({
  name: "content-check",
  buildStart() {
    const { error } = contentSchema.safeParse({
      experience,
      education,
      skills,
      projects,
    });
    if (error) {
      this.error(`src/content/data is invalid:\n${prettifyError(error)}`);
    }
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [contentCheck(), documentTitle(), themeScript(), react()],
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
  // Unit tests (Vitest) sit beside their modules; Playwright runs e2e/.
  test: {
    include: ["src/**/*.test.ts"],
    // A US time zone, where an ISO month parsed as UTC midnight is still the
    // previous month in local time (see common/utils/dates.ts).
    env: { TZ: "America/New_York" },
  },
});
