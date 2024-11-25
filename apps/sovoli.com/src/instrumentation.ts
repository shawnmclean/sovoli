import { registerOTel } from "@vercel/otel";

export function register() {
  console.log("Instrumentation registered");
  registerOTel({
    serviceName: "next-app",
  });
}
