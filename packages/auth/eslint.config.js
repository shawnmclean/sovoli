import baseConfig, { restrictEnvAccess } from "@sovoli/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  //...restrictEnvAccess,
];
