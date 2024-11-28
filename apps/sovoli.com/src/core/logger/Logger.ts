import pino from "pino";

export class Logger {
  private readonly logger: pino.Logger;

  constructor() {
    this.logger = pino();
  }

  debug(message: string, properties?: Record<string, unknown>) {
    this.logger.debug(properties, message);
  }

  info(message: string, properties?: Record<string, unknown>) {
    this.logger.info(properties, message);
  }

  warn(message: string, properties?: Record<string, unknown>) {
    this.logger.warn(properties, message);
  }

  error(message: string, properties?: Record<string, unknown>) {
    this.logger.error(properties, message);
  }
  fatal(message: string, properties?: Record<string, unknown>) {
    this.logger.fatal(properties, message);
  }
  trace(message: string, properties?: Record<string, unknown>) {
    this.logger.trace(properties, message);
  }
}
