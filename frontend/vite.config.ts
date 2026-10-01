import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { deprecations } from "sass";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
        fatalDeprecations: Object.values(deprecations).filter(
          (deprecation) => deprecation.status === "active"
        ),
      },
    },
  },
});
