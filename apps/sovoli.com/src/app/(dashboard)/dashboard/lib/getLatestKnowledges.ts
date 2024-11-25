import { context, trace } from "@opentelemetry/api";
import { LoggerProvider } from "@opentelemetry/sdk-logs";
import { and, db, desc, eq, lt, or, schema } from "@sovoli/db";
import pino from "pino";

const logger = pino();

interface GetLatestKnowledgesOptions {
  cursor?: {
    id: string;
    createdAt: Date;
  };
  limit?: number;
}

function getFeedFilter() {
  return and(
    eq(schema.Knowledge.isOrigin, true),
    eq(schema.Knowledge.isPublic, true),
  );
}

export const getLatestKnowledges = async ({
  cursor,
  limit = 10,
}: GetLatestKnowledgesOptions = {}) => {
  logger.info("inside getLatestKnowledges");

  const feedFilter = getFeedFilter();

  return db.query.Knowledge.findMany({
    with: {
      MediaAssets: true,
      User: {
        columns: {
          username: true,
          name: true,
          type: true,
        },
      },
    },
    where: and(
      feedFilter,
      cursor
        ? or(
            lt(schema.Knowledge.createdAt, cursor.createdAt),
            and(
              eq(schema.Knowledge.createdAt, cursor.createdAt),
              lt(schema.Knowledge.id, cursor.id),
            ),
          )
        : undefined,
    ),
    orderBy: [desc(schema.Knowledge.createdAt), desc(schema.Knowledge.id)],
    limit: limit,
  });
};
