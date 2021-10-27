module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        dim: "#f0f2f5",
        main: "#ededed",
        selected: "#e4e6eb",
        icons: "#65676b",
        dodgerblue: "#1877f2",
        WaGreen: "#dcf8c6",
        WaDarkGreen: "#009588",
      },
      fontSize: {
        xxs: ".6rem",
      },
      display: ["group-hover"],
    },
  },
  variants: {
    extend: {
      opacity: ["disabled", "hover"],
      cursor: ["disabled"],
    },
  },
  plugins: [],
};
