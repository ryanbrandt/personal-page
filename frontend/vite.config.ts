import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  // Aliases (@app, @styles) come from `paths` in tsconfig.json. They only apply
  // to files matched by its `include`, so add "src/**/*.scss" there before
  // using the aliases inside stylesheets.
  resolve: {
    tsconfigPaths: true,
  },
});
