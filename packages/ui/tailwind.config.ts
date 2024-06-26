/*
 * This file is not used for any compilation purpose, it is only used
 * for Tailwind Intellisense & Autocompletion in the source files
 */
import type { Config } from "tailwindcss";
// @ts-expect-error - no types
import nativewind from "nativewind/preset";

export default {
  content: ["src/**/*.tsx"],
  presets: [nativewind],
  important: "html",
} satisfies Config;
