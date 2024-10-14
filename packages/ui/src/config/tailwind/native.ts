import type { Config } from "tailwindcss";

import { base } from "./base";

export const native = {
  content: base.content,
  presets: [base],
  theme: {
    extend: {},
  },
} satisfies Config;
