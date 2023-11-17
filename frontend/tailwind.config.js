const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      logo: ["Lobster", "cursive"],
    },
    backgroundSize: {
      auto: "auto",
      cover: "cover",
      contain: "contain",
      "50%": "50%",
      16: "4rem",
      200: "200%",
    },
    extend: {
      backgroundImage: {
        "gradient-animation":
          "linear-gradient(to right, #4F46E5, #9333EA, #EC4899, #4F46E5)",
        "gradient-animation-2":
          "linear-gradient(to right, #f7b733, #fc4a1a, #f7b733, #fc4a1a)",
      },
      keyframes: {
        slide: {
          "0%": { "background-position": "200%" },
          "100%": { "background-position": "0%" },
        },
        grow: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        slide: "slide 5s linear infinite",
        grow: "grow 2s linear infinite",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".warning": {
          "@apply text-red-500 font-bold": {},
        },
      });
    }),
  ],
};
