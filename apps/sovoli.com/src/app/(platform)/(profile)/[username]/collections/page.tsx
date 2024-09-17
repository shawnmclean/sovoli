import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { count, db, eq, inArray, schema, sql } from "@sovoli/db";

import { config } from "~/utils/config";

export const dynamic = "force-dynamic";

interface Props {
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

// TODO: add auth user id to filter out public collections
async function getUserCollections({
  params: { username },
  searchParams: { page = 1, pageSize = 30 },
}: Props) {
  const filter = getCollectionsByUsernameFilter(username);

  const collectionsQuery = db
    .select({
      id: schema.Collection.id,
      name: schema.Collection.name,
      description: schema.Collection.description,
      isDefault: schema.Collection.isDefault,
      isPublic: schema.Collection.isPublic,
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
    .where(filter)
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

const retrieveUserCollections = cache(
  async ({ params, searchParams }: Props) => {
    try {
      return await getUserCollections({ params, searchParams });
    } catch (error) {
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

export default async function MyBooks({ params, searchParams }: Props) {
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
          <div key={collection.id}>
            <h2>{collection.name}</h2>
            <p>{collection.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
