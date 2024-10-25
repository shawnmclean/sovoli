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
      layout: {
        radius: {
          small: "2px", // rounded-small
          medium: "4px", // rounded-medium
          large: "6px", // rounded-larg
        },
      },
    }),
  ],
  theme: {
    extend: {},
  },
} satisfies Config;
