import type { Config } from "tailwindcss";
import { native } from "@sovoli/ui/config/tailwind/native";

const config = {
  darkMode: "class",
  content: [
    ...native.content,
    "../../packages/ui/src/components/**/*.{ts,tsx}",
    "../../packages/ui/src/screens/**/*.{ts,tsx}",
    "./node_modules/@sovoli/**/*.{ts,tsx}",
  ],
  presets: [native],
} satisfies Config;

export default config;
