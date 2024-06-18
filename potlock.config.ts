import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginSwr } from "@kubb/swagger-swr";
import { pluginTs } from "@kubb/swagger-ts";
import { pluginZod } from "@kubb/swagger-zod";

export default defineConfig({
  name: "potlock",
  root: "./",

  input: {
    path: "https://dev.potlock.io/api/schema",
  },

  output: {
    path: "./src/common/api/potlock/generated",
    clean: true,
  },

  plugins: [
    pluginOas(),
    pluginTs(),
    pluginZod(),

    pluginSwr({
      output: { path: "./hooks", exportAs: "swrHooks" },
      parser: "zod",
    }),
  ],

  hooks: {
    done: ["yarn format"],
  },
});
