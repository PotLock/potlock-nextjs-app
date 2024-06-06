import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginZod } from "@kubb/swagger-zod";
import { pluginZodios } from "@kubb/swagger-zodios";

export default defineConfig({
  root: ".",

  input: {
    path: "https://dev.potlock.io/api/schema",
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

  hooks: {
    done: ["yarn format"],
  },
});
