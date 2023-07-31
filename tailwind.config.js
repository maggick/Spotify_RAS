/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts,js}", "index.html"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui")
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#e0a562",
          "secondary": "#540589",
          "accent": "#f22e31",
          "neutral": "#27293a",
          "base-100": "#324453",
          "info": "#6487d8",
          "success": "#105b4b",
          "warning": "#eca241",
          "error": "#e34557",
          },
        },
      ],
    },
}
