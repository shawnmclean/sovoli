import { and, db, desc, eq, lt, or, schema } from "@sovoli/db";

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
    eq(schema.Knowledge.isPrivate, false),
  );
}

export const getLatestKnowledges = async ({
  cursor,
  limit = 10,
}: GetLatestKnowledgesOptions = {}) => {
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
