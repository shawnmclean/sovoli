import type { Config } from "tailwindcss";
import baseConfig from "@sovoli/ui/config/tailwind/native";

const config = {
  darkMode: "class",
  content: [
    ...baseConfig.content,
    "../../packages/ui/**/*.{ts,tsx}",
    "./node_modules/@sovoli/**/*.{ts,tsx}",
  ],
  presets: [baseConfig],
} satisfies Config;

export default config;
