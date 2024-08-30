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
        rotateY: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        slideInFromTop: {
          "0%": {
            transform: "translateY(-100%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        drop: "drop 1s",
        "rotateY-anim": "rotateY 1.5s linear infinite",
        "slideInFromTop-anim": "slideInFromTop 0.1s linear",
      },
    },
  },
  plugins: [],
};
