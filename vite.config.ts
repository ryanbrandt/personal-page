import * as path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  resolve: {
    alias: [
      { find: "@app", replacement: path.resolve(__dirname, "src") },
      { find: "@styles", replacement: path.resolve(__dirname, "src/styles") },
    ],
  },
  build: {
    emptyOutDir: true,
  },
});
