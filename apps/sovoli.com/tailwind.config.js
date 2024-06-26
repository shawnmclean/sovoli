/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../../packages/ui/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  presets: [require("nativewind/preset")],
  important: "html",
};
