import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],

  test: {
    environment: "jsdom",
    include: ["**/?(*.test|tests).?(c|m)[jt]s?(x)"],
    testTimeout: 2000,
  },
});
