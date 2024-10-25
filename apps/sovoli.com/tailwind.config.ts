import type { Config } from "tailwindcss";
import nextUIConfig from "@sovoli/ui/tailwind.config";

export default {
  content: [
    ...nextUIConfig.content,
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [nextUIConfig],
} satisfies Config;
