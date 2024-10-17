import { env as apiEnv } from "@sovoli/api/env";
import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
  extends: [apiEnv],

  runtimeEnv: process.env,

  server: {},
});
