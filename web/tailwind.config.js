/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: (() => {
        const columns = {};
        for (let i = 13; i <= 40; i++) {
          columns[i] = `repeat(${i}, minmax(0, 1fr))`;
        }
        return columns;
      })(),
      borderRadius: {
        main: "0.5rem",
      },
      colors: {
        primary: {
          50: "#fdf5ef",
          100: "#fae7da",
          200: "#f4ccb4",
          300: "#eda984",
          400: "#e57c52",
          500: "#de5c31",
          main: "#cb4325",
          700: "#ad3321",
          800: "#8a2b22",
          900: "#70261e",
          950: "#3c110e",
        },
        secondary: {
          50: "#e9faff",
          100: "#cef3ff",
          200: "#a7ecff",
          300: "#6be4ff",
          400: "#26cfff",
          500: "#00aaff",
          600: "#0080ff",
          700: "#0065ff",
          800: "#0056e6",
          900: "#004eb3",
          main: "#00387c",
        },
        amarrillo: {
          50: "#ffffea",
          100: "#fffbc5",
          200: "#fff885",
          300: "#ffee46",
          400: "#ffdf1b",
          main: "#ffc107",
          600: "#e29400",
          700: "#bb6902",
          800: "#985108",
          900: "#7c420b",
          950: "#482200",
        },
        black: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#3d3d3d",
          main: "#000000",
        },
        white: {
          main: "#ffffff",
          100: "#efefef",
          200: "#dcdcdc",
          300: "#bdbdbd",
          400: "#989898",
          500: "#7c7c7c",
          600: "#656565",
          700: "#525252",
          800: "#464646",
          900: "#3d3d3d",
          950: "#292929",
        },
      },
    },
  },
  plugins: [],
};
