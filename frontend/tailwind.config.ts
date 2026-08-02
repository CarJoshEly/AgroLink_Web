import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // AppColors — Fuente de verdad compartida con la app de Flutter
        primary: {
          DEFAULT: "#2E7D32", // verde agro
          dark: "#1B5E20",
          light: "#60AD5E",
        },
        secondary: {
          DEFAULT: "#F9A825", // dorado cosecha
          dark: "#C17900",
        },
        onPrimary: "#FFFFFF",
        onSecondary: "#1A1A1A",

        // Neutrales de AppColors
        bg: "#FAFAF7",
        surface: "#FFFFFF",
        surfaceVariant: "#F1F3EE",
        border: "#E0E3DA",
        textPrimary: "#1B1F18",
        textSecondary: "#5B6358",
        textDisabled: "#9AA396",

        // Modo oscuro
        bgDark: "#13160F",
        surfaceDark: "#1C2117",
        borderDark: "#343C2C",
        textPrimaryDark: "#EDF0E8",
        textSecondaryDark: "#B2BAA9",

        // Compatibilidad con la escala forest / maize / soil
        forest: {
          50: "#F1F3EE",
          100: "#E3F1E1",
          300: "#60AD5E",
          500: "#2E7D32",
          600: "#2E7D32",
          700: "#1B5E20",
          800: "#1B5E20",
          900: "#13160F",
          950: "#0C0E0A",
        },
        maize: {
          100: "#FCEFD0",
          300: "#F9A825",
          500: "#F9A825",
          600: "#C17900",
        },
        soil: {
          50: "#FAFAF7",
          100: "#E0E3DA",
          400: "#9AA396",
          500: "#5B6358",
          600: "#5B6358",
          800: "#1B1F18",
          900: "#1B1F18",
        },
        stone: {
          25: "#FAFAF7",
        },

        // Semántica de estado
        status: {
          success: "#2E7D32",
          successContainer: "#E3F1E1",
          warning: "#F9A825",
          warningContainer: "#FCEFD0",
          info: "#1976D2",
          infoContainer: "#DDEAFB",
          danger: "#C62828",
          dangerContainer: "#F9DEDE",
          neutral: "#616161",
          neutralContainer: "#E7E7E5",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        stamp: "6px",
      },
    },
  },
  plugins: [],
};

export default config;
