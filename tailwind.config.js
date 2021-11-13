module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    extend: {
      spacing: {
        108: "27rem",
        120: "30rem",
        132: "33rem",
      },
      minHeight: {
        2: "2",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
