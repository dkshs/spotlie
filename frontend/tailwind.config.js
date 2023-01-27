/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/components/**/*.tsx", "./src/pages/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        merriweather: "Merriweather Sans, sans-serif",
      },
    },
  },
  plugins: [],
};
