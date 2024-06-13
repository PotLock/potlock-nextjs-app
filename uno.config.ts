//import presetAttributify from "@unocss/preset-attributify";
import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetUno,
} from "unocss";
import presetAnimations from "unocss-preset-animations";
import presetAutoprefixer from "unocss-preset-autoprefixer";
import presetShadcn from "unocss-preset-shadcn";

export default defineConfig({
  presets: [
    presetUno(),
    presetAutoprefixer(),
    presetAttributify({ prefix: "un-", prefixOnly: true }),
    presetTypography(),
    presetAnimations(),

    presetShadcn({
      color: "slate",
    }),
  ],
});
