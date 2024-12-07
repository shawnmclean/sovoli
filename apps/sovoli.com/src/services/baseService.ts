import type { Exception } from "@opentelemetry/api";
import { trace } from "@opentelemetry/api";
import { db } from "@sovoli/db";

import { Logger } from "~/core/logger/Logger";

const tracer = trace.getTracer("your-custom-traces");

export abstract class BaseService<TOptions, TResult = void> {
  constructor(
    protected readonly dbClient: typeof db = db,
    protected readonly logger: Logger = new Logger(),
    protected readonly name: string = new.target.name,
  ) {}

  abstract execute(options: TOptions): Promise<TResult>;

  public async call(options: TOptions): Promise<TResult> {
    return tracer.startActiveSpan(this.name + ".call", async (span) => {
      try {
        // TODO: may need to run flatten on the options
        const serializedOptions = JSON.stringify(options);
        span.setAttribute("serviceName", this.name);
        span.setAttribute("input", serializedOptions);

        const result = await this.execute(options);

        // Serialize result if necessary
        const serializedResult = JSON.stringify(result);
        span.setAttribute("result", serializedResult);

        return result;
      } catch (error: unknown) {
        const exception: Exception =
          error instanceof Error ? error : String(error);
        span.recordException(exception); // Ensure the correct type is passed
        span.setStatus({
          code: 2,
          message: error instanceof Error ? error.message : String(error),
        });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}
