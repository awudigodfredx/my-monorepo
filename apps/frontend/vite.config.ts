import { defineConfig } from "vitest/config"; // ← vitest/config, not vite
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.test.tsx", "src/**/*.test.ts"],
  },
});
