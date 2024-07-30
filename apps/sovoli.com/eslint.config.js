import baseConfig, { restrictEnvAccess } from "@sovoli/eslint-config/base";
import nextjsConfig from "@sovoli/eslint-config/nextjs";
import reactConfig from "@sovoli/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
