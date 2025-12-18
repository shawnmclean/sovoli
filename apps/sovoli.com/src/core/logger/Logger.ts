import { flatten } from "flat";
import type { LoggerOptions } from "pino";
import pino from "pino";

import { env } from "~/env";

export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

const environment = env.VERCEL_ENV ?? env.NODE_ENV;
const isNodeRuntime = process.env.NEXT_RUNTIME === "nodejs";

export class Logger {
  private readonly logger: pino.Logger;

  constructor() {
    const options: LoggerOptions = {
      base: {
        environment,
      },
    };

    // Only use OTEL transport in Node.js runtime (not edge)
    if (isNodeRuntime) {
      options.transport = {
        target: "pino-opentelemetry-transport",
      };
    }

    this.logger = pino(options);
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
