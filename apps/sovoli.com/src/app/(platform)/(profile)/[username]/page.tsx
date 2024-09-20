import type { Metadata } from "next";
import { cache } from "react";
// import { notFound } from "next/navigation";
import { auth } from "@sovoli/auth";
import {
  alias,
  and,
  count,
  db,
  eq,
  inArray,
  or,
  schema,
  sql,
} from "@sovoli/db";
import { KnowledgeType } from "@sovoli/db/schema";

import { config } from "~/utils/config";

export const dynamic = "force-dynamic";

interface BaseOptions {
  authUserId?: string;
}
interface GetUserCollectionsOptions extends BaseOptions {
  params: { username: string };
  searchParams: { page: number | undefined; pageSize: number | undefined };
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

async function getUserCollections({
  params: { username },
  searchParams: { page = 1, pageSize = 30 },
  authUserId,
}: GetUserCollectionsOptions) {
  const usernameFilter = getByUsernameFilter(username);
  const privacyFilter = getPrivacyFilter(authUserId);

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

  const childKnowledge = alias(schema.Knowledge, "child_knowledge");
  const knowledgeConnectionSubquery = db
    .$with("knowledge_connection_subquery")
    .as(
      db
        .select({
          knowledgeId: schema.Knowledge.id,
          totalConnections: count(schema.KnowledgeConnection.id).as(
            "totalConnections",
          ),
          totalBooks: sql<number>`
          COUNT(${childKnowledge.id}) FILTER (WHERE ${childKnowledge.type} = ${KnowledgeType.Book})
        `.as("totalBooks"),
        })
        .from(schema.Knowledge)
        .where(and(usernameFilter, privacyFilter))
        .leftJoin(
          schema.KnowledgeConnection,
          eq(schema.KnowledgeConnection.sourceKnowledgeId, schema.Knowledge.id),
        )
        .leftJoin(
          childKnowledge,
          eq(schema.KnowledgeConnection.targetKnowledgeId, childKnowledge.id),
        )
        .groupBy(schema.Knowledge.id),
    );

  const collectionsQuery = db
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
    })
    .from(schema.Knowledge)
    .where(and(usernameFilter, privacyFilter))
    .leftJoin(
      knowledgeConnectionSubquery,
      eq(knowledgeConnectionSubquery.knowledgeId, schema.Knowledge.id),
    )
    .leftJoin(
      mediaAssetsSubquery,
      eq(mediaAssetsSubquery.knowledgeId, schema.Knowledge.id),
    )
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const [user, collections] = await Promise.all([
    db.query.User.findFirst({
      columns: {
        id: true,
        name: true,
        username: true,
      },
      where: eq(schema.User.username, username),
    }),
    collectionsQuery,
  ]);

  // Extract total collections from the first collection (since it's duplicated in all rows)
  const totalItems = collections.length > 0 ? collections[0]?.totalItems : 0;

  // Remove totalCollections from individual collections
  const cleanedCollections = collections.map(
    ({ totalItems: _, ...rest }) => rest,
  );

  if (!user) throw Error("User not found");

  return {
    user,
    collections: {
      data: cleanedCollections,
      meta: { page, pageSize, total: totalItems },
    },
  };
}

interface Props {
  params: { username: string };
  searchParams: { page: number | undefined; pageSize: number | undefined };
}

const retrieveUserCollections = cache(
  async ({ params, searchParams }: Props) => {
    const session = await auth();
    // try {
    return await getUserCollections({
      params,
      searchParams,
      authUserId: session?.user?.id,
    });
    // } catch {
    //   return notFound();
    // }
  },
);

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { user } = await retrieveUserCollections({ params, searchParams });

  return {
    title: `${user.name}'s Collections`,
    openGraph: {
      title: `${user.name}'s Collections`,
      url: config.url + "/" + params.username + "/collections/",
      siteName: config.siteName,
    },
  };
}

export default async function UserCollectionsPage({
  params,
  searchParams,
}: Props) {
  const { user, collections } = await retrieveUserCollections({
    params,
    searchParams,
  });

  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <h1>{user.name}'s Collections</h1>

      <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(collections, null, 2)}</pre>
      <div>
        {collections.data.map((collection) => (
          <a
            key={collection.id}
            href={`/${params.username}/${collection.slug}`}
          >
            <h2>{collection.name}</h2>
          </a>
        ))}
      </div>
    </div>
  );
}
