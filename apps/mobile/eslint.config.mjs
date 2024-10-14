import baseConfig from "@sovoli/eslint-config/base";
import expoConfig from "@sovoli/eslint-config/expo";
import reactConfig from "@sovoli/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...expoConfig,
];
