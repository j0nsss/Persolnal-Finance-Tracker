import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          bg: "#F4F4F0",
          ink: "#000000",
          surface: "#FFFFFF",
          "bg-dark": "#1A1A1A",
          "ink-dark": "#F4F4F0",
          "surface-dark": "#2A2A2A",
        },
        accent: {
          lime: "#D4FF3F",
          pink: "#FF3F8E",
          orange: "#FF6B1A",
          blue: "#3F8EFF",
        },
        feedback: {
          success: "#00C853",
          danger: "#FF3B30",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        brutal: "4px 4px 0px #000000",
        "brutal-sm": "2px 2px 0px #000000",
        "brutal-lg": "8px 8px 0px #000000",
        "brutal-pressed": "1px 1px 0px #000000",
        "brutal-accent": "4px 4px 0px #D4FF3F",
        "brutal-dark": "4px 4px 0px #F4F4F0",
        "brutal-sm-dark": "2px 2px 0px #F4F4F0",
        "brutal-lg-dark": "8px 8px 0px #F4F4F0",
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
