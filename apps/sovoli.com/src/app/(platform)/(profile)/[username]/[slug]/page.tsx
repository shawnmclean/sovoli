import { cache } from "react";
import { auth } from "@sovoli/auth";
import { and, count, db, eq, inArray, or, schema, sql } from "@sovoli/db";
import { KnowledgeType } from "@sovoli/db/schema";

export const dynamic = "force-dynamic";

interface BaseOptions {
  authUserId?: string;
}
interface GetKnowledgeBySlugOptions extends BaseOptions {
  username: string;
  slug: string;
}

function getByUsernameFilter(username: string) {
  return inArray(
    schema.Knowledge.userId,
    db
      .select({ id: schema.User.id })
      .from(schema.User)
      .where(eq(schema.User.username, username)),
  );
}

function getPrivacyFilter(authUserId?: string) {
  // always include public collections
  const isPrivate = eq(schema.Knowledge.isPrivate, false);
  if (!authUserId) return isPrivate;

  // if the user is authenticated, include private collections only if the user is the owner
  return or(
    isPrivate,
    and(
      eq(schema.Knowledge.isPrivate, true),
      eq(schema.Knowledge.userId, authUserId),
    ),
  );
}

async function getKnowledgeBySlug({
  username,
  slug,
  authUserId,
}: GetKnowledgeBySlugOptions) {
  const usernameFilter = getByUsernameFilter(username);
  const privacyFilter = getPrivacyFilter(authUserId);
  const slugFilter = eq(schema.Knowledge.slug, slug);

  const mediaAssetsSubquery = db.$with("media_assets_subquery").as(
    db
      .select({
        knowledgeId: schema.KnowledgeMediaAsset.knowledgeId,
        mediaAssets: sql`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'media_asset_id', ${schema.MediaAsset.id},
              'host', ${schema.MediaAsset.host},
              'bucket', ${schema.MediaAsset.bucket},
              'path', ${schema.MediaAsset.path}
            )
          )`.as("mediaAssets"),
      })
      .from(schema.KnowledgeMediaAsset)
      .leftJoin(
        schema.MediaAsset,
        eq(schema.MediaAsset.id, schema.KnowledgeMediaAsset.mediaAssetId),
      )
      .groupBy(schema.KnowledgeMediaAsset.knowledgeId),
  );

  const knowledgeConnectionSubquery = db
    .$with("knowledge_connection_subquery")
    .as(
      db
        .select({
          sourceKnowledgeId: schema.KnowledgeConnection.sourceKnowledgeId,
          connections: sql`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${schema.KnowledgeConnection.id},
              'sourceKnowledgeId', ${schema.KnowledgeConnection.sourceKnowledgeId},
              'targetKnowledgeId', ${schema.KnowledgeConnection.targetKnowledgeId},
              'notes', ${schema.KnowledgeConnection.notes},
              'createdAt', ${schema.KnowledgeConnection.createdAt},
              'updatedAt', ${schema.KnowledgeConnection.updatedAt},
              'Knowledge', JSON_BUILD_OBJECT(
                'id', ${schema.Knowledge.id},
                'name', ${schema.Knowledge.name},
                'type', ${schema.Knowledge.type},
                'description', ${schema.Knowledge.description}
              )
            )
          )`.as("connections"),
          totalConnections: count(schema.KnowledgeConnection.id).as(
            "totalConnections",
          ),
          totalBooks: sql<number>`
          COUNT(${schema.Knowledge.id}) FILTER (WHERE ${schema.Knowledge.type} = ${KnowledgeType.Book})
        `.as("totalBooks"),
        })
        .from(schema.KnowledgeConnection)
        .where(privacyFilter)
        .leftJoin(
          schema.Knowledge,
          eq(schema.KnowledgeConnection.targetKnowledgeId, schema.Knowledge.id),
        )
        .groupBy(schema.KnowledgeConnection.sourceKnowledgeId),
    );

  const knowledgeQuery = db
    .with(mediaAssetsSubquery, knowledgeConnectionSubquery)
    .select({
      id: schema.Knowledge.id,
      slug: schema.Knowledge.slug,
      name: schema.Knowledge.name,
      description: schema.Knowledge.description,
      type: schema.Knowledge.type,
      isPrivate: schema.Knowledge.isPrivate,
      createdAt: schema.Knowledge.createdAt,
      updatedAt: schema.Knowledge.updatedAt,
      // using a window function to count the number of collections matching the filter (ignoring pagination)
      totalItems: sql<number>`COUNT(*) OVER()`.as("totalItems"),
      // totalItems: knowledgeConnectionSubquery.totalItems,
      totalBooks: knowledgeConnectionSubquery.totalBooks,
      totalConnections: knowledgeConnectionSubquery.totalConnections,
      mediaAssets: sql`COALESCE(${mediaAssetsSubquery.mediaAssets}, '[]')`,
      connections: sql`COALESCE(${knowledgeConnectionSubquery.connections}, '[]')`,
    })
    .from(schema.Knowledge)
    .where(and(usernameFilter, privacyFilter, slugFilter))
    .leftJoin(
      knowledgeConnectionSubquery,
      eq(knowledgeConnectionSubquery.sourceKnowledgeId, schema.Knowledge.id),
    )
    .leftJoin(
      mediaAssetsSubquery,
      eq(mediaAssetsSubquery.knowledgeId, schema.Knowledge.id),
    )
    .limit(1);

  const [user, knowledgeResults] = await Promise.all([
    db.query.User.findFirst({
      columns: {
        id: true,
        name: true,
        username: true,
      },
      where: eq(schema.User.username, username),
    }),
    knowledgeQuery,
  ]);

  const knowledge = knowledgeResults[0];

  if (!user) throw Error("User not found");
  if (!knowledge) throw Error("Knowledge not found");

  return {
    user,
    knowledge,
  };
}

interface Props {
  params: { username: string; slug: string };
}

const retreiveKnowledgeBySlug = cache(async ({ params }: Props) => {
  const session = await auth();
  // try {
  return await getKnowledgeBySlug({
    username: params.username,
    authUserId: session?.user?.id,
    slug: params.slug,
  });
  // } catch {
  //   return notFound();
  // }
});

export default async function KnowledgePage({ params }: Props) {
  const response = await retreiveKnowledgeBySlug({
    params,
  });

  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <h1>Knowledge Details</h1>
      <a href={`/${params.username}`}>Back to {params.username}</a>

      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
}
