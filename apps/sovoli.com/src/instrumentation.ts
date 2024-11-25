import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({
    serviceName: "next-app",
    instrumentations: [new PinoInstrumentation()],
  });
}
