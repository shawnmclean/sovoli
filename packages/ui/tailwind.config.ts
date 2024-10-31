import { commonColors, nextui } from "@nextui-org/theme";
import typography from "@tailwindcss/typography";
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
    typography,
    nextui({
      themes: {
        dark: {},
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
      typography: (theme: (arg0: string) => any) => ({
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
            "--tw-prose-invert-headings": commonColors.white,
            "--tw-prose-invert-lead": theme("twColors.neutral[400]"),
            "--tw-prose-invert-links": commonColors.white,
            "--tw-prose-invert-bold": commonColors.white,
            "--tw-prose-invert-counters": theme("twColors.neutral[400]"),
            "--tw-prose-invert-bullets": theme("twColors.neutral[600]"),
            "--tw-prose-invert-hr": theme("twColors.neutral[700]"),
            "--tw-prose-invert-quotes": theme("twColors.neutral[100]"),
            "--tw-prose-invert-quote-borders": theme("twColors.neutral[700]"),
            "--tw-prose-invert-captions": theme("twColors.neutral[400]"),
            "--tw-prose-invert-code": commonColors.white,
            "--tw-prose-invert-pre-code": "hsl(var(--nextui-default-300))",
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": theme("twColors.neutral[600]"),
            "--tw-prose-invert-td-borders": theme("twColors.neutral[700]"),
          },
        },
      }),
    },
  },
} satisfies Config;
