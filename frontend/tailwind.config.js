/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/components/**/*.tsx", "./src/pages/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        merriweather: "Merriweather Sans, sans-serif",
      },
      screens: {
        xxs: "352px",
        xs: "460px",
      },
      animation: {
        player: "player 20s linear infinite",
      },
      keyframes: {
        player: {
          "0%, 100%": { backgroundPosition: "center" },
          "50%": { backgroundPosition: "bottom" },
        },
      },
    },
  },
  plugins: [],
};
