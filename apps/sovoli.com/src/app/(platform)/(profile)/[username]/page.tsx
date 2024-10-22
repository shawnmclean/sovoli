import type { Metadata } from "next";
import { cache } from "react";
// import { notFound } from "next/navigation";
import { auth } from "@sovoli/auth";
import { and, count, db, eq, inArray, or, schema, sql } from "@sovoli/db";
import { KnowledgeType } from "@sovoli/db/schema";

import { config } from "~/utils/config";

export const dynamic = "force-dynamic";

interface BaseOptions {
  authUserId?: string;
}
interface GetKnowledgesOptions extends BaseOptions {
  username: string;
  searchParams: { page: number | undefined; pageSize: number | undefined };
}

function getFeedFilter() {
  return eq(schema.Knowledge.isOrigin, true);
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

async function getKnowledges({
  username,
  searchParams: { page = 1, pageSize = 30 },
  authUserId,
}: GetKnowledgesOptions) {
  const usernameFilter = getByUsernameFilter(username);
  const privacyFilter = getPrivacyFilter(authUserId);
  const feedFilter = getFeedFilter();

  const mediaAssetsSubquery = db.$with("media_assets_subquery").as(
    db
      .select({
        knowledgeId: schema.MediaAsset.knowledgeId,
        mediaAssets: sql`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${schema.MediaAsset.id},
              'knowledgeId', ${schema.MediaAsset.knowledgeId},
              'order', ${schema.MediaAsset.order},
              'host', ${schema.MediaAsset.host},
              'bucket', ${schema.MediaAsset.bucket},
              'path', ${schema.MediaAsset.path},
              'createdAt', ${schema.MediaAsset.createdAt},
              'updatedAt', ${schema.MediaAsset.updatedAt}
            )
          )`.as("mediaAssets"),
      })
      .from(schema.MediaAsset)
      .groupBy(schema.MediaAsset.knowledgeId),
  );

  const knowledgeConnectionSubquery = db
    .$with("knowledge_connection_subquery")
    .as(
      db
        .select({
          sourceKnowledgeId: schema.KnowledgeConnection.sourceKnowledgeId,
          totalConnections: count(schema.KnowledgeConnection.id).as(
            "totalConnections",
          ),
          totalBooks: sql<number>`
          COUNT(${schema.Knowledge.id}) FILTER (WHERE ${schema.Knowledge.type} = ${KnowledgeType.book})
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

  const knowledgesQuery = db
    .with(mediaAssetsSubquery, knowledgeConnectionSubquery)
    .select({
      id: schema.Knowledge.id,
      slug: schema.Knowledge.slug,
      title: schema.Knowledge.title,
      description: schema.Knowledge.description,
      type: schema.Knowledge.type,
      isOrigin: schema.Knowledge.isOrigin,
      isPrivate: schema.Knowledge.isPrivate,
      createdAt: schema.Knowledge.createdAt,
      updatedAt: schema.Knowledge.updatedAt,
      // using a window function to count the number of collections matching the filter (ignoring pagination)
      totalItems: sql<number>`COUNT(*) OVER()`.as("totalItems"),
      // totalItems: knowledgeConnectionSubquery.totalItems,
      totalBooks: knowledgeConnectionSubquery.totalBooks,
      totalConnections: knowledgeConnectionSubquery.totalConnections,
      MediaAssets: sql`COALESCE(${mediaAssetsSubquery.mediaAssets}, '[]')`,
    })
    .from(schema.Knowledge)
    .where(and(usernameFilter, privacyFilter, feedFilter))
    .leftJoin(
      knowledgeConnectionSubquery,
      eq(knowledgeConnectionSubquery.sourceKnowledgeId, schema.Knowledge.id),
    )
    .leftJoin(
      mediaAssetsSubquery,
      eq(mediaAssetsSubquery.knowledgeId, schema.Knowledge.id),
    )
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const [user, knowledges] = await Promise.all([
    db.query.User.findFirst({
      columns: {
        id: true,
        name: true,
        username: true,
      },
      where: eq(schema.User.username, username),
    }),
    knowledgesQuery,
  ]);

  // Extract total collections from the first collection (since it's duplicated in all rows)
  const totalItems = knowledges.length > 0 ? knowledges[0]?.totalItems : 0;

  // Remove totalCollections from individual collections
  const cleanedKnowledges = knowledges.map(
    ({ totalItems: _, ...rest }) => rest,
  );

  if (!user) throw Error("User not found");

  return {
    user,
    knowledges: {
      data: cleanedKnowledges,
      meta: { page, pageSize, total: totalItems },
    },
  };
}

interface Props {
  params: { username: string };
  searchParams: { page: number | undefined; pageSize: number | undefined };
}

const retrieveKnowledges = cache(async ({ params, searchParams }: Props) => {
  const session = await auth();
  // try {
  return await getKnowledges({
    username: params.username,
    searchParams,
    authUserId: session?.user?.id,
  });
  // } catch {
  //   return notFound();
  // }
});

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { user } = await retrieveKnowledges({ params, searchParams });

  return {
    title: `${user.name}'s Collections`,
    openGraph: {
      title: `${user.name}'s Collections`,
      url: config.url + "/" + params.username + "/collections/",
      siteName: config.siteName,
    },
  };
}

export default async function KnowledgesPage({ params, searchParams }: Props) {
  const { user, knowledges: collections } = await retrieveKnowledges({
    params,
    searchParams,
  });

  return (
    <div className="min-h-screen sm:pl-60 dark:bg-black">
      <h1>{user.name}'s Collections</h1>
      <div>
        {collections.data.map((collection) => (
          <a
            key={collection.id}
            href={`/${params.username}/${collection.slug ?? collection.id}`}
          >
            <h2>{collection.title}</h2>
          </a>
        ))}
      </div>
    </div>
  );
}
