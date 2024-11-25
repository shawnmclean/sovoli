import { env } from "./env.js";

console.log("instrumentation");
export async function register() {
  console.log("registering instrumentation");
  if (env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation.node");
  }
}
