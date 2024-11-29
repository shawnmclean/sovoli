export async function register() {
  // eslint-disable-next-line turbo/no-undeclared-env-vars, no-restricted-properties
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("instrumentation registering");
    await import("./instrumentation.node");
  }
}
