import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "happy-dom",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      // pub-list.json is generated and gitignored; point tests at a committed
      // fixture so they run without a data export. Object aliases match by
      // prefix, so the specific path must precede "@".
      "@/data/pub-list.json": fileURLToPath(new URL("./src/islands/__fixtures__/pub-list.json", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
