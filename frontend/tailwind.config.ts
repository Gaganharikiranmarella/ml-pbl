import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0e1018",
        mist: "#f5f7ff",
        sunrise: "#ff7b54",
        lagoon: "#2fb9b2",
        citrus: "#ffd166",
        dusk: "#243b7a",
      },
      boxShadow: {
        halo: "0 20px 60px rgba(47, 185, 178, 0.25)",
      },
      animation: {
        float: "float 8s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
