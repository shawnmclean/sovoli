import { env } from "./env";

export async function register() {
  if (env.NEXT_RUNTIME === "nodejs") {
    console.log("instrumentation registering");
    await import("./instrumentation.node");
  }
}
