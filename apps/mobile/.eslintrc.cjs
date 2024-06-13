/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@sovoli/eslint-config/expo.js'],
  ignorePatterns: [
    'node_modules',
    'build',
    '.expo',
    '.expo-shared',
    'metro.config.js',
  ],
}
