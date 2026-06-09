export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#101114",
        mist: "#f5f7fb",
        citron: "#d7ff5f",
        coral: "#ff7a66",
        aqua: "#4fd1c5",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(79, 209, 197, 0.18)",
      },
    },
  },
  plugins: [],
};
