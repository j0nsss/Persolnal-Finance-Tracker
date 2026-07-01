import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          bg: "rgb(var(--color-base-bg) / <alpha-value>)",
          ink: "rgb(var(--color-base-ink) / <alpha-value>)",
          surface: "rgb(var(--color-base-surface) / <alpha-value>)",
        },
        accent: {
          lime: "rgb(var(--color-accent-lime) / <alpha-value>)",
          pink: "rgb(var(--color-accent-pink) / <alpha-value>)",
          orange: "rgb(var(--color-accent-orange) / <alpha-value>)",
          blue: "rgb(var(--color-accent-blue) / <alpha-value>)",
        },
        feedback: {
          success: "rgb(var(--color-feedback-success) / <alpha-value>)",
          danger: "rgb(var(--color-feedback-danger) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        brutal: "var(--shadow-brutal)",
        "brutal-sm": "var(--shadow-brutal-sm)",
        "brutal-lg": "var(--shadow-brutal-lg)",
        "brutal-pressed": "var(--shadow-brutal-pressed)",
        "brutal-accent": "var(--shadow-brutal-accent)",
      },
      borderWidth: {
        3: "3px",
      },
      borderRadius: {
        brutal: "4px",
      },
    },
  },
  plugins: [],
} satisfies Config;
