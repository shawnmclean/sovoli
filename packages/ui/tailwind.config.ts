import { nextui } from "@nextui-org/theme";
import { Config } from "tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
    "../.././node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            primary: {
              100: "#CFE9FE",
              200: "#A0D0FD",
              300: "#70B2F9",
              400: "#4C96F4",
              500: "#146BED",
              600: "#0E52CB",
              700: "#0A3DAA",
              800: "#062A89",
              900: "#031D71",
              DEFAULT: "#146BED",
            },
            success: {
              100: "#E8FAD2",
              200: "#CCF6A7",
              300: "#A2E376",
              400: "#78C950",
              500: "#44A521",
              600: "#2F8D18",
              700: "#1D7610",
              800: "#0F5F0A",
              900: "#064F07",
              DEFAULT: "#44A521",
            },
            info: {
              100: "#CCF0FE",
              200: "#9ADDFE",
              300: "#67C4FD",
              400: "#41ABFB",
              500: "#0483F9",
              600: "#0265D6",
              700: "#024BB3",
              800: "#013590",
              900: "#002577",
              DEFAULT: "#0483F9",
            },
            warning: {
              100: "#FFF3CC",
              200: "#FFE499",
              300: "#FFD266",
              400: "#FFBF3F",
              500: "#FFA100",
              600: "#DB8200",
              700: "#B76600",
              800: "#934C00",
              900: "#7A3A00",
              DEFAULT: "#FFA100",
            },
            danger: {
              100: "#FFE3D3",
              200: "#FFC1A9",
              300: "#FF987E",
              400: "#FF705D",
              500: "#FF2F28",
              600: "#DB1D27",
              700: "#B7142A",
              800: "#930C2A",
              900: "#7A072A",
              DEFAULT: "#FF2F28",
            },
          },
        },
      },
      layout: {
        radius: {
          small: "2px", // rounded-small
          medium: "4px", // rounded-medium
          large: "6px", // rounded-large
        },
      },
    }),
  ],
  theme: {
    extend: {},
  },
} satisfies Config;
