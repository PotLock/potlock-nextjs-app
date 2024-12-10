import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",

  // TODO: Complete theme migration to `uno.config.ts`
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

    extend: {
      backgroundImage: {
        hero: "url('/assets/images/hero-bg.svg')",
      },

      fontSize: {
        xl: "22px", // Customize the text-xl size to 22px
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

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        beacon: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        beacon: "beacon 1.5s infinite",
      },

      fontFamily: {
        lora: ["var(--font-lora)", ...fontFamily.sans],
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
