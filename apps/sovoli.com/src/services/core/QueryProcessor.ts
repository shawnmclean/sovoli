/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Attributes, Exception } from "@opentelemetry/api";
import { trace } from "@opentelemetry/api";
import { flatten } from "flat";

import type { Query } from "./Query";
import type { QueryHandler } from "./QueryHandler";
import { Logger } from "~/core/logger/Logger";

const tracer = trace.getTracer("sovoli-query-processor");

export class QueryProcessor {
  private handlers = new Map<
    new (...args: any[]) => Query<any>,
    QueryHandler<any, any>
  >();

  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  register<TQuery extends Query<TResult>, TResult>(
    queryType: new (...args: any[]) => TQuery,
    handler: QueryHandler<TQuery, TResult>,
  ): void {
    this.handlers.set(queryType, handler);
  }

  async execute<TResult>(query: Query<TResult>): Promise<TResult> {
    return tracer.startActiveSpan(
      `QueryProcessor.${query.constructor.name}`,
      async (span) => {
        try {
          const serializedOptions = this.flattenProperties({
            input: query,
          });
          span.setAttribute("queryName", query.constructor.name);
          span.setAttributes(serializedOptions);

          const handler = this.handlers.get(
            query.constructor as new (...args: any[]) => Query<TResult>,
          ) as QueryHandler<Query<TResult>, TResult> | undefined;
          if (!handler) {
            throw new Error(
              `No handler registered for query: ${query.constructor.name}`,
            );
          }

          const result = await handler.handle(query);

          const serializedResult = this.flattenProperties({
            output: result,
          });
          span.setAttributes(serializedResult);

          return result;
        } catch (error: unknown) {
          const errorDetails: Record<string, unknown> =
            error instanceof Error
              ? { name: error.name, message: error.message, stack: error.stack }
              : { message: String(error) };

          this.logger.error(
            `Error executing query: ${query.constructor.name}`,
            errorDetails,
          );

          span.recordException(error as Exception);
          span.setStatus({
            code: 2,
            message: error instanceof Error ? error.message : String(error),
          });

          throw error;
        } finally {
          span.end();
        }
      },
    );
  }
  private flattenProperties(object: unknown): Attributes {
    return flatten(object);
  }
}
