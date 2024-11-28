import { flatten } from "flat";
import pino from "pino";

export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

export class Logger {
  private readonly logger: pino.Logger;

  constructor() {
    this.logger = pino();
  }

  public trace(message: string, properties?: Record<string, unknown>) {
    this.log("trace", message, properties);
  }
  public debug(message: string, properties?: Record<string, unknown>) {
    this.log("debug", message, properties);
  }
  public info(message: string, properties?: Record<string, unknown>) {
    this.log("info", message, properties);
  }
  public warn(message: string, properties?: Record<string, unknown>) {
    this.log("warn", message, properties);
  }
  public error(message: string, properties?: Record<string, unknown>) {
    this.log("error", message, properties);
  }
  public fatal(message: string, properties?: Record<string, unknown>) {
    this.log("fatal", message, properties);
  }

  private log(
    logLevel: LogLevel,
    message: string,
    properties?: Record<string, unknown>,
  ) {
    const flattenProperties = properties ? flatten(properties) : undefined;
    if (flattenProperties) {
      this.logger[logLevel](flattenProperties, message);
    } else {
      this.logger[logLevel](message);
    }
  }
}
