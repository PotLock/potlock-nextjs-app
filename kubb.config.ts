import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginZod } from "@kubb/swagger-zod";
import { pluginZodios } from "@kubb/swagger-zodios";

export default defineConfig({
  root: ".",

  input: {
    path: "./src/common/api/potlock/index.yaml",
  },

  output: {
    path: "./src/common/api/potlock/generated",
    clean: true,
  },

  plugins: [
    pluginOas(),
    pluginZod(),

    pluginZodios({
      output: { path: "./zodios.ts" },
    }),
  ],
});
