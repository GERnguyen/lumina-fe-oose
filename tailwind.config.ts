import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          50: colors.slate[50],
          100: colors.gray[200],
          200: colors.gray[300],
          300: colors.stone[300],
          400: colors.gray[400],
          500: colors.gray[400],
          600: colors.gray[500],
          700: colors.gray[600],
          800: colors.zinc[700],
          900: colors.neutral[800],
        },
        primary: {
          100: colors.orange[50],
          200: colors.orange[100],
          300: colors.orange[300],
          400: colors.red[400],
          500: colors.orange[500],
          600: colors.orange[700],
          700: colors.orange[800],
          800: colors.orange[900],
          900: colors.orange[950],
        },
        secondary: {
          100: colors.violet[100],
          200: colors.indigo[200],
          300: colors.violet[400],
          400: colors.indigo[500],
          500: colors.indigo[600],
          600: colors.indigo[700],
          700: colors.indigo[800],
          800: colors.violet[950],
          900: colors.slate[900],
        },
        success: {
          100: colors.green[100],
          200: colors.green[200],
          300: colors.green[300],
          400: colors.green[400],
          500: colors.green[600],
          600: colors.green[700],
          700: colors.green[800],
          800: colors.green[900],
          900: colors.green[950],
        },
        warning: {
          100: colors.orange[50],
          200: colors.orange[200],
          300: colors.orange[300],
          400: colors.orange[400],
          500: colors.amber[500],
          600: colors.amber[600],
          700: colors.yellow[700],
          800: colors.yellow[900],
          900: colors.yellow[950],
        },
        danger: {
          100: colors.rose[50],
          200: colors.red[200],
          300: colors.red[300],
          400: colors.red[400],
          500: colors.red[500],
          600: colors.red[700],
          700: colors.red[900],
          800: colors.pink[950],
          900: colors.stone[900],
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
