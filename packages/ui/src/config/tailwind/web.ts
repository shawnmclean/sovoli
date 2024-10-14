import type { Config } from "tailwindcss";

import { base } from "./base";

export const web = {
  content: base.content,
  presets: [base],
  theme: {
    extend: {},
  },
} satisfies Config;
