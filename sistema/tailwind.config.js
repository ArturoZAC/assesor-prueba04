export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
      "path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          nulshock: ["nulshock", "sans-serif"],
        },
        colors: {
          primary: "#1E1F25",
          main: "#cb4325",
          main_dark: "#c75c5c",
          form: "#fff",
          secondary: {
            50: "#384045",
            150: "#906B9F",
            100: "#1E1F25",
            900: "#131517",
          },
          main_2: {
            100: "#fff",
            150: "#F9FAFB",
            250: "#E9E9E9",
            200: "#906B9F",
            900: "#131517",
          },
        },
      },
    },
    plugins: [],
  };
  