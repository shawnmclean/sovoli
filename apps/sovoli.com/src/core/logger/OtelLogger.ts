import type { HrTime, Span, SpanOptions } from "@opentelemetry/api";
import type { Logger } from "@opentelemetry/api-logs";
import { PreciseDate } from "@google-cloud/precise-date";
import { SeverityNumber } from "@opentelemetry/api-logs";

import { flattenAttributes } from "./flattenAttributes";

export type LogLevel = "none" | "error" | "warn" | "info" | "debug" | "log";

export const logLevels: LogLevel[] = ["none", "error", "warn", "info", "debug"];

export interface TaskLoggerConfig {
  logger: Logger;
  level: LogLevel;
}

export interface TaskLogger {
  debug(message: string, properties?: Record<string, unknown>): void;
  log(message: string, properties?: Record<string, unknown>): void;
  info(message: string, properties?: Record<string, unknown>): void;
  warn(message: string, properties?: Record<string, unknown>): void;
  error(message: string, properties?: Record<string, unknown>): void;
  trace<T>(
    name: string,
    fn: (span: Span) => Promise<T>,
    options?: SpanOptions,
  ): Promise<T>;
}

export class OtelLogger implements TaskLogger {
  private readonly level: number;

  constructor(private readonly config: TaskLoggerConfig) {
    this.level = logLevels.indexOf(config.level);
  }

  debug(message: string, properties?: Record<string, unknown>) {
    if (this.level < 4) return; // ["none", "error", "warn", "info", "debug"];

    this.emitLog(
      message,
      this.getTimestampInHrTime(),
      "debug",
      SeverityNumber.DEBUG,
      properties,
    );
  }

  log(message: string, properties?: Record<string, unknown>) {
    if (this.level < 3) return; // ["none", "error", "warn", "info", "debug"];

    this.emitLog(
      message,
      this.getTimestampInHrTime(),
      "log",
      SeverityNumber.INFO,
      properties,
    );
  }

  info(message: string, properties?: Record<string, unknown>) {
    if (this.level < 3) return; // ["none", "error", "warn", "info", "debug"];

    this.emitLog(
      message,
      this.getTimestampInHrTime(),
      "info",
      SeverityNumber.INFO,
      properties,
    );
  }

  warn(message: string, properties?: Record<string, unknown>) {
    if (this.level < 2) return; // ["none", "error", "warn", "info", "debug"];

    this.emitLog(
      message,
      this.getTimestampInHrTime(),
      "warn",
      SeverityNumber.WARN,
      properties,
    );
  }

  error(message: string, properties?: Record<string, unknown>) {
    if (this.level < 1) return; // ["none", "error", "warn", "info", "debug"];

    this.emitLog(
      message,
      this.getTimestampInHrTime(),
      "error",
      SeverityNumber.ERROR,
      properties,
    );
  }

  private emitLog(
    message: string,
    timestamp: HrTime,
    severityText: string,
    severityNumber: SeverityNumber,
    properties?: Record<string, unknown>,
  ) {
    const attributes = flattenAttributes(properties);

    this.config.logger.emit({
      severityNumber,
      severityText,
      body: message,
      attributes,
      timestamp,
    });
  }

  trace<T>(
    _name: string,
    _fn: (span: Span) => Promise<T>,
    _options?: SpanOptions,
  ): Promise<T> {
    throw new Error("Method not implemented.");
  }

  getTimestampInHrTime(): HrTime {
    const preciseDate = new PreciseDate();
    return preciseDate.toTuple();
  }
}
