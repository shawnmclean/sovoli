import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import { SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";

const sdk = new NodeSDK({
  serviceName: "sovoli.com",
  spanProcessors: [new SimpleSpanProcessor(new OTLPTraceExporter())],
  logRecordProcessors: [new SimpleLogRecordProcessor(new OTLPLogExporter())],
  instrumentations: [new PinoInstrumentation()],
});
sdk.start();
