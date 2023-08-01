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
    themes: false,
    },
}
