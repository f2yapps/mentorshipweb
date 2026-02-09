import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Africa-friendly warm palette: earth tones, sunset, growth
        primary: {
          50: "#fef7ee",
          100: "#fdedd6",
          200: "#f9d7ac",
          300: "#f4ba77",
          400: "#ee9340",
          500: "#ea761a",
          600: "#db5c10",
          700: "#b54410",
          800: "#903615",
          900: "#742f14",
          950: "#3f1508",
        },
        earth: {
          50: "#f6f5f0",
          100: "#e9e6db",
          200: "#d5cfbc",
          300: "#bdb396",
          400: "#a89b78",
          500: "#988a66",
          600: "#8a7a59",
          700: "#72634a",
          800: "#5f5340",
          900: "#504637",
          950: "#2b251f",
        },
        accent: {
          green: "#2d5a27",
          gold: "#c9a227",
          teal: "#0d9488",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
