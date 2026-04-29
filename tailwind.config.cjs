/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cairo", "Outfit", "sans-serif"],
        display: ["Outfit", "Cairo", "sans-serif"],
      },
      colors: {
        premium: {
          ink: "#07110f",
          teal: "#18d5bd",
          gold: "#f5b84b",
          rose: "#f05776",
        },
      },
      boxShadow: {
        premium: "0 28px 90px rgba(0, 0, 0, 0.34)",
        glow: "0 0 32px rgba(24, 213, 189, 0.24)",
      },
    },
  },
  plugins: [],
};
