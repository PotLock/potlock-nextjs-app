import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetUno,
  transformerVariantGroup,
} from "unocss";
import { presetAnimations } from "unocss-preset-animations";
import presetAutoprefixer from "unocss-preset-autoprefixer";
import { presetShadcn } from "unocss-preset-shadcn";

export default defineConfig({
  presets: [
    presetUno(),
    presetAutoprefixer(),
    presetAttributify(),
    presetTypography(),
    presetAnimations(),
    presetShadcn({ color: "slate" }),
  ],

  transformers: [transformerVariantGroup()],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1rem",
        "2xl": "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    colors: {
      primary: {
        50: "#fef3f2",
        400: "#f6767a",
        600: "#dd3345",
        DEFAULT: "hsl(var(--primary))",
        foreground: {
          DEFAULT: "hsl(var(--primary-foreground))",
        },
      },

      conifer: {
        50: "#F7FDE8",
        600: "#629D13",
      },

      corn: {
        50: "#fDfCe9",
        500: "#ECC113",
      },

      peach: {
        50: "#fef6ee",
        100: "#FCE9D5",
        300: "#f4b37d",
        400: "#EE8949",
        500: "#EA6A25",
        600: "#DB521B",
        700: "#B63D18",
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

      background: "hsl(var(--background))",

      foreground: {
        DEFAULT: "hsl(var(--foreground))",
      },

      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: {
          DEFAULT: "hsl(var(--card-foreground))",
        },
      },

      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: {
          DEFAULT: "hsl(var(--popover-foreground))",
        },
      },

      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: {
          DEFAULT: "hsl(var(--secondary-foreground))",
        },
      },

      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: {
          DEFAULT: "hsl(var(--muted-foreground))",
        },
      },

      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: {
          DEFAULT: "hsl(var(--accent-foreground))",
        },
      },

      success: "hsl(var(--success))",

      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: {
          DEFAULT: "hsl(var(--destructive-foreground))",
        },
      },

      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
    },
    fontSize: {
      xl: "22px",
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
    boxShadow: {
      "button-focus": "var(--focus-shadow)",
      "button-primary": "var(--button-primary)",
      "button-tonal": "var(--button-tonal)",
    },
    fontFamily: {
      lora: ["var(--font-lora)", "sans-serif"],
    },
  },

  rules: [
    ["hidden", { display: "none" }],

    ["bg-hero", { "background-image": "url('/assets/images/hero-bg.svg')" }],

    [
      "elevation-low",
      {
        "box-shadow":
          "0px 0px 1px 0px rgba(0, 0, 0, 0.36), 0px 1px 1px -0.5px rgba(55, 55, 55, 0.04), 0px 2px 2px -1px rgba(5, 5, 5, 0.08), 0px 3px 5px -1.5px rgba(55, 55, 55, 0.04)",
      },
    ],
  ],

  shortcuts: {
    "btn-primary": "bg-primary text-primary-foreground hover:bg-primary/90",
    "btn-secondary": "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    "btn-destructive": "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    "btn-outline": "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    "focus-shadow": "shadow-[var(--focus-shadow)]",
    "button-primary": "shadow-[var(--button-primary)]",
    "button-tonal": "shadow-[var(--button-tonal)]",

    "inline-with-icon": "important:[&>svg]:top-a justify-center",
  },

  preflights: [
    {
      getCSS: () => `
        @keyframes accordion-down {
          from { height: 0 }
          to { height: var(--radix-accordion-content-height) }
        }

        @keyframes accordion-up {
          from { height: var(--radix-accordion-content-height) }
          to { height: 0 }
        }

        @keyframes beacon {
          0%, 100% { transform: scale(1) }
          50% { transform: scale(1.3) }
        }

        .animate-accordion-down { animation: accordion-down 0.2s ease-out }
        .animate-accordion-up { animation: accordion-up 0.2s ease-out }
        .animate-beacon { animation: beacon 1.5s infinite }

        [role="combobox"] .selector-option-appendix { display: none }
      `,
    },
  ],
});
