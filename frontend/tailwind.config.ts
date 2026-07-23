import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Paleta AgroLink — inspirada en el campo hondureño:
        // tierra, follaje y grano maduro. Nada de beige/terracota genérico.
        soil: {
          50: "#f6f2ec",
          100: "#ebe1d1",
          200: "#d3bd9c",
          400: "#a06a3f",
          600: "#7a4a2c",
          800: "#5a3420",
          900: "#3d2416",
        },
        forest: {
          50: "#eef3ee",
          100: "#d3e2d4",
          300: "#7fa985",
          500: "#3f7350",
          600: "#2c5a3c",
          700: "#204631",
          800: "#173424",
          900: "#0f241a",
        },
        maize: {
          100: "#fbe9c2",
          300: "#f2c968",
          500: "#e0a72e",
          600: "#c08c1e",
        },
        stone: {
          25: "#fbfaf7",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        stamp: "3px",
      },
    },
  },
  plugins: [],
};

export default config;
