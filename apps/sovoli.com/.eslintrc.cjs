/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@sovoli/eslint-config/remix.js'],
  ignorePatterns: ['!**/.server', '!**/.client'],
}
