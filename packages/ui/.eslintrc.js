/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@sovoli/eslint-config/react-native.js"],
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },
};
