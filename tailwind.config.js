/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#122D3D",
        secondary: "#666666",
        accent: "#76ECCC",
        neutral: "#EEEEEE",
      },
    },
  },
  plugins: [],
};