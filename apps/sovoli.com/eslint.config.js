import baseConfig, { restrictEnvAccess } from "@sovoli/eslint-config/base";
import nextjsConfig from "@sovoli/eslint-config/nextjs";
import reactConfig from "@sovoli/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  // TODO: turn this back on when we are ready to use env vars
  // ...restrictEnvAccess,
];
