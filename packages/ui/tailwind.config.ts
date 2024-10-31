import { commonColors, nextui } from "@nextui-org/theme";
import typography from "@tailwindcss/typography";
import { Config } from "tailwindcss";
import { PluginUtils } from "tailwindcss/types/config";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
    "../.././node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    typography,
    nextui({
      themes: {
        dark: {
          colors: {
            default: {
              100: "#FFFFFF",
              200: "#F5F5F5",
              300: "#E0E0E0",
              400: "#BDBDBD",
              500: "#9E9E9E",
              600: "#757575",
              700: "#616161",
              800: "#424242",
              900: "#212121",
              DEFAULT: "#9E9E9E",
            },
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
            secondary: {
              100: "#F1F8FF",
              200: "#DDEBFF",
              300: "#BBCFEE",
              400: "#99AFC5",
              500: "#7C8B99",
              600: "#636E75",
              700: "#4B565E",
              800: "#353F44",
              900: "#1E272A",
              DEFAULT: "#7C8B99",
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
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "hsl(var(--nextui-default-700))",
            "--tw-prose-headings": "hsl(var(--nextui-foreground))",
            "--tw-prose-lead": "hsl(var(--nextui-default-600))",
            "--tw-prose-links": "hsl(var(--nextui-default-900))",
            "--tw-prose-bold": "hsl(var(--nextui-default-900))",
            "--tw-prose-counters": "hsl(var(--nextui-default-500))",
            "--tw-prose-bullets": "hsl(var(--nextui-default-300))",
            "--tw-prose-hr": "hsl(var(--nextui-default-200))",
            "--tw-prose-quotes": "hsl(var(--nextui-default-900))",
            "--tw-prose-quote-borders": "hsl(var(--nextui-default-200))",
            "--tw-prose-captions": "hsl(var(--nextui-default-500))",
            "--tw-prose-code": "hsl(var(--nextui-default-900))",
            "--tw-prose-pre-code": "hsl(var(--nextui-default-200))",
            "--tw-prose-pre-bg": "hsl(var(--nextui-default-800))",
            "--tw-prose-th-borders": "hsl(var(--nextui-default-300))",
            "--tw-prose-td-borders": "hsl(var(--nextui-default-200))",
            "--tw-prose-invert-body": "hsl(var(--nextui-default-300))",
          },
        },
      },
    },
  },
} satisfies Config;
