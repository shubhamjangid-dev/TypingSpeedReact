/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        drop: {
          "0%": { height: "0" },
          "100%": { height: "0" },
        },
      },
      animation: {
        drop: "drop 1s",
      },
    },
  },
  plugins: [],
};
