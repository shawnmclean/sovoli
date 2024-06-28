import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
// @ts-expect-error - no types
import nativewind from "nativewind/preset";
import baseConfig from "@sovoli/ui/config/tailwind/web";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...baseConfig.content, "../../packages/ui/**/*.{ts,tsx}"],
  presets: [baseConfig, nativewind],
  important: "html",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
    },
  },
} satisfies Config;
