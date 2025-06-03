/** @type {import('tailwindcss').Config} */
const defaultConfig = require("shadcn/ui/tailwind.config")

module.exports = {
  ...defaultConfig,
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    ...defaultConfig.theme,
    extend: {
      ...defaultConfig.theme.extend,
      fontFamily: {
        mono: ["Courier New", "Monaco", "Menlo", "Consolas", "monospace"],
        cyber: ["Courier New", "Monaco", "Menlo", "Consolas", "monospace"],
      },
      colors: {
        ...defaultConfig.theme.extend.colors,
        "neon-blue": "#00f5ff",
        "neon-purple": "#bf00ff",
        "neon-green": "#39ff14",
        "cyber-dark": "#0a0a0f",
        "cyber-gray": "#1a1a2e",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": {
            boxShadow: "0 0 5px rgba(59, 130, 246, 0.5)",
          },
          "100%": {
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(139, 92, 246, 0.6)",
          },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        neon: "0 0 20px rgba(59, 130, 246, 0.5)",
        "neon-lg": "0 0 30px rgba(59, 130, 246, 0.7)",
        "purple-neon": "0 0 20px rgba(139, 92, 246, 0.5)",
        "green-neon": "0 0 20px rgba(34, 197, 94, 0.5)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [...defaultConfig.plugins, require("tailwindcss-animate")],
}
