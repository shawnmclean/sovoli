import { env } from "./env.js";

export async function register() {
  console.log("registering instrumentation");
  if (env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation.node");
  }
}
