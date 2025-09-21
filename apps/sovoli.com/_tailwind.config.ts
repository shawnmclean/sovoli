import type { Config } from "tailwindcss";
import heroUIConfig from "@sovoli/ui/tailwind.config";

export default {
  content: [
    ...heroUIConfig.content,
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [heroUIConfig],
} satisfies Config;
