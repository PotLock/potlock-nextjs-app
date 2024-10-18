import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetUno,
  transformerVariantGroup,
} from "unocss";
import presetAnimations from "unocss-preset-animations";
import presetAutoprefixer from "unocss-preset-autoprefixer";
import presetShadcn from "unocss-preset-shadcn";

export default defineConfig({
  presets: [
    presetUno(),
    presetAutoprefixer(),
    presetAttributify(),
    presetTypography(),
    presetAnimations(),
    presetShadcn({
      color: "slate",
    }),
  ],

  transformers: [transformerVariantGroup()],

  theme: {
    colors: {
      primary: {
        50: "#fef3f2",
        400: "#f6767a",
        600: "#dd3345",

        DEFAULT: "hsl(var(--primary))",
        light: "hsl(0 0% 27%)",
        dark: "hsl(210 40% 98%)",

        foreground: {
          DEFAULT: "hsl(var(--primary-foreground))",
          light: "hsl(210 40% 98%)",
          dark: "hsl(222.2 47.4% 11.2%)",
        },
      },
      peach: {
        50: "#fef6ee",
      },
      neutral: {
        50: "#f7f7f7",
        100: "#ebebeb",
        200: "#dbdbdb",
        300: "#c7c7c7",
        400: "#a6a6a6",
        500: "#7b7b7b",
        600: "#656565",
        700: "#525252",
        800: "#464646",
        900: "#2e2e2e",
      },
      background: {
        DEFAULT: "hsl(var(--background))",
        light: "hsl(0 0% 100%)",
        dark: "hsl(222.2 84% 4.9%)",
      },
      foreground: {
        DEFAULT: "hsl(var(--foreground))",
        light: "hsl(222.2 84% 4.9%)",
        dark: "hsl(210 40% 98%)",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        light: "hsl(0 0% 100%)",
        dark: "hsl(222.2 84% 4.9%)",
        foreground: {
          DEFAULT: "hsl(var(--card-foreground))",
          light: "hsl(222.2 84% 4.9%)",
          dark: "hsl(210 40% 98%)",
        },
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        light: "hsl(0 0% 100%)",
        dark: "hsl(222.2 84% 4.9%)",
        foreground: {
          DEFAULT: "hsl(var(--popover-foreground))",
          light: "hsl(222.2 84% 4.9%)",
          dark: "hsl(210 40% 98%)",
        },
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        light: "hsl(210 40% 96.1%)",
        dark: "hsl(217.2 32.6% 17.5%)",
        foreground: {
          DEFAULT: "hsl(var(--secondary-foreground))",
          light: "hsl(222.2 47.4% 11.2%)",
          dark: "hsl(210 40% 98%)",
        },
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        light: "hsl(210 40% 96.1%)",
        dark: "hsl(217.2 32.6% 17.5%)",
        foreground: {
          DEFAULT: "hsl(var(--muted-foreground))",
          light: "hsl(215.4 16.3% 46.9%)",
          dark: "hsl(215 20.2% 65.1%)",
        },
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        light: "hsl(30 89% 96%)",
        dark: "hsl(217.2 32.6% 17.5%)",
        foreground: {
          DEFAULT: "hsl(var(--accent-foreground))",
          light: "hsl(21 82% 53%)",
          dark: "hsl(210 40% 98%)",
        },
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        light: "hsl(0 84.2% 60.2%)",
        dark: "hsl(0 62.8% 30.6%)",
        foreground: {
          DEFAULT: "hsl(var(--destructive-foreground))",
          light: "hsl(210 40% 98%)",
          dark: "hsl(210 40% 98%)",
        },
      },
      border: {
        DEFAULT: "hsl(var(--border))",
        light: "hsl(214.3 31.8% 91.4%)",
        dark: "hsl(217.2 32.6% 17.5%)",
      },
      input: {
        DEFAULT: "hsl(var(--input))",
        light: "hsl(0 0% 65%)",
        dark: "hsl(0 0% 86%)",
      },
      ring: {
        DEFAULT: "hsl(var(--ring))",
        light: "hsl(0 0% 78%)",
        dark: "hsl(212.7 26.8% 83.9%)",
      },
    },
  },
  shortcuts: {
    "not-displayed": "display-[none]",
    "btn-primary": "bg-primary text-primary-foreground hover:bg-primary/90",
    "btn-secondary":
      "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    "btn-destructive":
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    "btn-outline":
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    "focus-shadow": "shadow-[var(--focus-shadow)]",
    "button-primary": "shadow-[var(--button-primary)]",
    "button-tonal": "shadow-[var(--button-tonal)]",
  },
});
