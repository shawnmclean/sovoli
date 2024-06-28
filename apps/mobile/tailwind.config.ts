import type { Config } from "tailwindcss";
// @ts-expect-error - no types
import nativewind from "nativewind/preset";

import baseConfig from "@sovoli/ui/config/tailwind/native";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [...baseConfig.content, "../../packages/ui/**/*.{ts,tsx}"],
  presets: [baseConfig, nativewind],
};
