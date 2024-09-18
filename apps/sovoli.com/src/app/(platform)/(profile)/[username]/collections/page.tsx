import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { auth } from "@sovoli/auth";
import { and, count, db, eq, inArray, or, schema, sql } from "@sovoli/db";

import { config } from "~/utils/config";

export const dynamic = "force-dynamic";

interface BaseOptions {
  authUserId?: string;
}
interface GetUserCollectionsOptions extends BaseOptions {
  params: { username: string };
  searchParams: { page: number | undefined; pageSize: number | undefined };
}

function getCollectionsByUsernameFilter(username: string) {
  return inArray(
    schema.Collection.userId,
    db
      .select({ id: schema.User.id })
      .from(schema.User)
      .where(eq(schema.User.username, username)),
  );
}

function getPrivacyFilter(authUserId?: string) {
  // always include public collections
  const isPrivate = eq(schema.Collection.isPrivate, false);
  if (!authUserId) return isPrivate;

  // if the user is authenticated, include private collections only if the user is the owner
  return or(
    isPrivate,
    and(
      eq(schema.Collection.isPrivate, true),
      eq(schema.Collection.userId, authUserId),
    ),
  );
}

async function getUserCollections({
  params: { username },
  searchParams: { page = 1, pageSize = 30 },
  authUserId,
}: GetUserCollectionsOptions) {
  const filter = getCollectionsByUsernameFilter(username);
  const privacyFilter = getPrivacyFilter(authUserId);

  const collectionsQuery = db
    .select({
      id: schema.Collection.id,
      slug: schema.Collection.slug,
      name: schema.Collection.name,
      description: schema.Collection.description,
      isDefault: schema.Collection.isDefault,
      isPrivate: schema.Collection.isPrivate,
      createdAt: schema.Collection.createdAt,
      updatedAt: schema.Collection.updatedAt,
      totalItems: count(schema.CollectionItem.id),
      totalBooks: sql<number>`
        COUNT(CASE WHEN ${schema.KnowledgeResource.bookId} IS NOT NULL THEN 1 ELSE NULL END)
      `.as("totalBooks"),

      // using a window function to count the number of collections matching the filter (ignoring pagination)
      totalCollections: sql<number>`COUNT(*) OVER()`.as("totalCollections"),
    })
    .from(schema.Collection)
    .where(and(filter, privacyFilter))
    .leftJoin(
      schema.CollectionItem,
      eq(schema.CollectionItem.collectionId, schema.Collection.id),
    )
    .leftJoin(
      schema.KnowledgeResource,
      eq(
        schema.CollectionItem.knowledgeResourceId,
        schema.KnowledgeResource.id,
      ),
    )
    .groupBy(schema.Collection.id)
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
  const totalCollections =
    collections.length > 0 ? collections[0]?.totalCollections : 0;

  // Remove totalCollections from individual collections
  const cleanedCollections = collections.map(
    ({ totalCollections: _, ...rest }) => rest,
  );

  if (!user) throw Error("User not found");

  return {
    user,
    collections: {
      data: cleanedCollections,
      meta: { page, pageSize, total: totalCollections },
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
    try {
      return await getUserCollections({
        params,
        searchParams,
        authUserId: session?.user?.id,
      });
    } catch {
      return notFound();
    }
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
            href={`/${params.username}/collections/${collection.slug}`}
          >
            <h2>{collection.name}</h2>
          </a>
        ))}
      </div>
    </div>
  );
}
