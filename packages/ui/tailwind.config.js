/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  prefix: "ui-",
  presets: [require("nativewind/preset")],
  important: "html",
};
