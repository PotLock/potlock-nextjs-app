import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  envPrefix: "NEXT_PUBLIC_",
  plugins: [tsconfigPaths(), react()],

  test: {
    environment: "jsdom",
    include: ["_tests/*.tests.ts?(x)"],
    testTimeout: 2000,
  },
});
