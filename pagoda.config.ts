import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginSwr } from "@kubb/swagger-swr";
import { pluginTs } from "@kubb/swagger-ts";
import { pluginZod } from "@kubb/swagger-zod";

export default defineConfig({
  name: "pagoda-eapi",
  root: "./",

  input: {
    path: "./pagoda-eapi.schema.json",
  },

  output: {
    path: "./src/common/api/pagoda/generated",
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
