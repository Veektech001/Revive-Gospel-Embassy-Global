/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171416", // main dark background
        coal: "#231F21", // raised dark surface (cards, footer)
        stone: "#E7E0D6", // light sections (from the original hero)
        sand: "#CFC4B6", // lines and muted fills on stone
        ash: "#A89F96", // secondary text on dark
        flame: "#F2A93B", // the one accent: "undying fire"
      },
      fontFamily: {
        montserrat: ["Montserrat", "system-ui", "sans-serif"],
        anton: ["Anton", "Impact", "Haettenschweiler", "sans-serif"],
      },
      maxWidth: {
        site: "72rem",
      },
    },
  },
  plugins: [],
};
