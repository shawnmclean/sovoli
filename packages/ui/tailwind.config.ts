import { commonColors, heroui } from "@heroui/theme";
import typography from "@tailwindcss/typography";
import { Config } from "tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
    "../.././node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    typography,
    heroui({
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
      backgroundImage: {
        "hero-section-title":
          "linear-gradient(91deg, #FFF 32.88%, rgba(255, 255, 255, 0.40) 99.12%)",
      },
      keyframes: {
        neonPulse: {
          "0%, 100%": {
            boxShadow: `
              0 0 5px #800080,
              0 0 10px #ff00ff,
              0 0 20px #800080,
              0 0 40px #ff00ff
            `,
          },
          "50%": {
            boxShadow: `
              0 0 10px #ff00ff,
              0 0 20px #800080,
              0 0 30px #ff00ff,
              0 0 50px #800080
            `,
          },
        },
      },
      animation: {
        neonPulse: "neonPulse 2s ease-in-out infinite",
      },
      typography: (theme: (arg0: string) => any) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "hsl(var(--heroui-default-700))",
            "--tw-prose-headings": "hsl(var(--heroui-foreground))",
            "--tw-prose-lead": "hsl(var(--heroui-default-600))",
            "--tw-prose-links": "hsl(var(--heroui-default-900))",
            "--tw-prose-bold": "hsl(var(--heroui-default-900))",
            "--tw-prose-counters": "hsl(var(--heroui-default-500))",
            "--tw-prose-bullets": "hsl(var(--heroui-default-300))",
            "--tw-prose-hr": "hsl(var(--heroui-default-200))",
            "--tw-prose-quotes": "hsl(var(--heroui-default-900))",
            "--tw-prose-quote-borders": "hsl(var(--heroui-default-200))",
            "--tw-prose-captions": "hsl(var(--heroui-default-500))",
            "--tw-prose-code": "hsl(var(--heroui-default-900))",
            "--tw-prose-pre-code": "hsl(var(--heroui-default-200))",
            "--tw-prose-pre-bg": "hsl(var(--heroui-default-800))",
            "--tw-prose-th-borders": "hsl(var(--heroui-default-300))",
            "--tw-prose-td-borders": "hsl(var(--heroui-default-200))",
            "--tw-prose-invert-body": "hsl(var(--heroui-default-300))",
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
            "--tw-prose-invert-pre-code": "hsl(var(--heroui-default-300))",
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": theme("twColors.neutral[600]"),
            "--tw-prose-invert-td-borders": theme("twColors.neutral[700]"),
          },
        },
      }),
    },
  },
} satisfies Config;
