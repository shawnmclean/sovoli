/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import type { Query } from "./Query";
import type { QueryHandler } from "./QueryHandler";

export class QueryProcessor {
  private handlers = new Map<
    new (...args: any[]) => Query<any>,
    QueryHandler<any, any>
  >();

  register<TQuery extends Query<TResult>, TResult>(
    queryType: new (...args: any[]) => TQuery,
    handler: QueryHandler<TQuery, TResult>,
  ): void {
    this.handlers.set(queryType, handler);
  }

  async execute<TResult>(query: Query<TResult>): Promise<TResult> {
    const handler = this.handlers.get(
      query.constructor as new (...args: any[]) => Query<TResult>,
    ) as QueryHandler<Query<TResult>, TResult> | undefined; // ✅ Ensure correct typing

    if (!handler) {
      throw new Error(
        `No handler registered for query: ${query.constructor.name}`,
      );
    }

    return handler.handle(query);
  }
}
