import { context, trace } from "@opentelemetry/api";

export type LogLevel = "trace" | "debug" | "info" | "warn" | "error";
const logLevels: LogLevel[] = ["trace", "error", "warn", "info", "debug"];

export class Logger {
  private readonly level: number;
  constructor(
    private name: string,
    level: LogLevel = "info",
  ) {
    this.level = logLevels.indexOf(level);
  }

  public trace(
    message: string,
    ...args: (Record<string, unknown> | undefined)[]
  ) {
    if (this.level < 0) return;

    this.structuredLog(console.log, message, "log", ...args);
  }

  public error(
    message: string,
    ...args: (Record<string, unknown> | undefined)[]
  ) {
    if (this.level < 1) return;

    this.structuredLog(console.error, message, "error", ...args);
  }

  public warn(
    message: string,
    ...args: (Record<string, unknown> | undefined)[]
  ) {
    if (this.level < 2) return;

    this.structuredLog(console.warn, message, "warn", ...args);
  }

  public info(
    message: string,
    ...args: (Record<string, unknown> | undefined)[]
  ) {
    if (this.level < 3) return;

    this.structuredLog(console.info, message, "info", ...args);
  }

  public debug(
    message: string,
    ...args: (Record<string, unknown> | undefined)[]
  ) {
    if (this.level < 4) return;

    this.structuredLog(console.debug, message, "debug", ...args);
  }

  private structuredLog(
    loggerFunction: (message: string, ...args: unknown[]) => void,
    message: string,
    level: string,
    ...args: (Record<string, unknown> | undefined)[]
  ) {
    const currentSpan = trace.getSpan(context.active());

    const structuredLog = {
      ...args,
      timestamp: new Date(),
      name: this.name,
      message,
      level,
      traceId: currentSpan?.isRecording()
        ? currentSpan.spanContext().traceId
        : undefined,
      parentSpanId: currentSpan?.isRecording()
        ? currentSpan.spanContext().spanId
        : undefined,
    };

    loggerFunction(JSON.stringify(structuredLog));
  }
}
