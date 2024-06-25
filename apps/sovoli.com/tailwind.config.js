/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/**/*.{ts,tsx}", "../../packages/ui/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  presets: [require("nativewind/preset")],
  important: "html",
};
