import { registerOTel } from "@vercel/otel";

export function register() {
  console.log("Instrumentation registered");
  registerOTel("your-service-name");
}
