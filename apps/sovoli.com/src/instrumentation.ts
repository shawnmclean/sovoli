// eslint-disable-next-line @typescript-eslint/no-unused-vars -- would like to use this if it works, tracked here: https://github.com/t3-oss/t3-env/issues/287
import { env } from "./env";

export async function register() {
  // eslint-disable-next-line turbo/no-undeclared-env-vars, no-restricted-properties
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("instrumentation registering");
    await import("./instrumentation.node");
  }
}
