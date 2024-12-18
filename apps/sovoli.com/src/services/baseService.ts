import type { Attributes, Exception } from "@opentelemetry/api";
import { trace } from "@opentelemetry/api";
import { db } from "@sovoli/db";
import { flatten } from "flat";

import { Logger } from "~/core/logger/Logger";

const tracer = trace.getTracer("sovoli-services");

export abstract class BaseService<TOptions, TResult = void> {
  constructor(
    protected readonly name: string,
    protected readonly dbClient: typeof db = db,
    protected readonly logger: Logger = new Logger(),
  ) {}

  protected abstract execute(options: TOptions): Promise<TResult>;

  public async call(options: TOptions): Promise<TResult> {
    return tracer.startActiveSpan(this.name + ".call", async (span) => {
      try {
        const serializedOptions = this.flattenProperties({
          input: options,
        });
        span.setAttribute("serviceName", this.name);
        span.setAttributes(serializedOptions);

        const result = await this.execute(options);

        const serializedResult = this.flattenProperties({
          output: result,
        });
        span.setAttributes(serializedResult);

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

  private flattenProperties(object: unknown): Attributes {
    return flatten(object);
  }
}
