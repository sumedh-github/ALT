import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        gold: "var(--color-gold)",
        taupe: "var(--color-taupe)",
        text: "var(--color-text)",
        muted: "var(--color-muted)"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"]
      },
      backgroundImage: {
        "alt-grain":
          "radial-gradient(circle at 20% 20%, rgba(201, 169, 110, 0.08), transparent 45%), radial-gradient(circle at 80% 0%, rgba(184, 168, 152, 0.08), transparent 35%)"
      },
      boxShadow: {
        luxe: "0 10px 30px rgba(0, 0, 0, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
