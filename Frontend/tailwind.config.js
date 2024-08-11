/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".text-stroke": {
          color: "white",
          "text-shadow": `
            -2px -2px 0 white,
            2px -2px 0 white,
            -2px 2px 0 white,
            2px 2px 0 white,
            -2px 0 0 white,
            2px 0 0 white,
            0 -2px 0 white,
            0 2px 0 white
          `,
        },
        // You can add more utilities for thicker strokes if needed
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    }),
  ],
};
