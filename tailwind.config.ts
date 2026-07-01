import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#171717", // primary black
          700: "#2b2b2b",
          500: "#525252",
          400: "#737373", // secondary gray
          200: "#d4d4d4",
          100: "#e5e5e5", // hairline gray
          50: "#fafafa",
        },
        success: {
          DEFAULT: "#16a34a",
          subtle: "#f0fdf4",
        },
        warning: {
          DEFAULT: "#dc2626",
          subtle: "#fef2f2",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,23,23,0.04), 0 4px 16px rgba(23,23,23,0.04)",
        "card-hover": "0 2px 4px rgba(23,23,23,0.06), 0 12px 24px rgba(23,23,23,0.08)",
        modal: "0 8px 16px rgba(23,23,23,0.08), 0 24px 48px rgba(23,23,23,0.16)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "stamp-in": {
          "0%": { opacity: "0", transform: "scale(1.15) rotate(-3deg)" },
          "60%": { opacity: "1", transform: "scale(0.98) rotate(-1deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(-1deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        "stamp-in": "stamp-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
