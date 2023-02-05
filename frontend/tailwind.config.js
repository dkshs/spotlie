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
        playerFadeIn: "playerFadeIn 0.5s linear forwards",
      },
      keyframes: {
        player: {
          "0%, 100%": { backgroundPosition: "center" },
          "50%": { backgroundPosition: "bottom" },
        },
        playerFadeIn: {
          "0%": { transform: "translateY(88px)", opacity: 0 },
          "100%": { transform: "translateY(0px)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
