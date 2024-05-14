import { defineConfig, presetAttributify, presetUno } from "unocss";
import presetAnimations from "unocss-preset-animations";
import presetShadcn from "unocss-preset-shadcn";

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetUno(),
    presetAnimations(),
    presetAttributify(),
    presetShadcn({ color: "slate" }),
  ],
});
