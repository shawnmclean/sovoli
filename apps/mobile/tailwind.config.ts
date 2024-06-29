import type { Config } from "tailwindcss";
// @ts-expect-error - no types
import nativewind from "nativewind/preset";

import baseConfig from "@sovoli/ui/config/tailwind/native";

export default {
  content: [
    ...baseConfig.content,
    "../../packages/ui/**/*.{ts,tsx}",
    "./node_modules/@sovoli/**/*.{ts,tsx}",
  ],
  presets: [baseConfig, nativewind],
} satisfies Config;
