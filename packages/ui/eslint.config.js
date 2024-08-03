import baseConfig from "@sovoli/eslint-config/base";
import reactConfig from "@sovoli/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];
