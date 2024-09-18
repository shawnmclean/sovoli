import type { Book } from "@sovoli/db/schema";
import type { Metadata } from "next";
import { cache } from "react";
import { auth } from "@sovoli/auth";
import { and, db, eq, inArray, schema, sql } from "@sovoli/db";

import { config } from "~/utils/config";

export const dynamic = "force-dynamic";

interface BaseOptions {
  authUserId?: string;
}

interface Props extends BaseOptions {
  params: { username: string; slug: string };
  searchParams: { page: number | undefined; pageSize: number | undefined };
}

function getCollectionByUsernameFilter(username: string) {
  return inArray(
    schema.Collection.userId,
    db
      .select({ id: schema.User.id })
      .from(schema.User)
      .where(eq(schema.User.username, username)),
  );
}

function getCollectionBySlugFilter(slug: string) {
  return inArray(
    schema.Collection.id,
    db
      .select({ id: schema.Collection.id })
      .from(schema.Collection)
      .where(eq(schema.Collection.slug, slug)),
  );
}

async function getUserCollectionBySlug({
  params: { username, slug },
  searchParams: { page = 1, pageSize = 30 },
  authUserId,
}: Props) {
  const usernameFilter = getCollectionByUsernameFilter(username);
  const slugFilter = getCollectionBySlugFilter(slug);

  const collection = await db.query.Collection.findFirst({
    with: {
      User: true,
    },
    where: and(usernameFilter, slugFilter),
  });

  if (!collection) throw Error("Collection not found");

  if (collection.isPrivate && collection.userId !== authUserId)
    throw Error("Collection is private");

  const collectionItems = await db
    .select({
      id: schema.CollectionItem.id,
      note: schema.CollectionItem.notes,
      knowledge: {
        id: schema.KnowledgeResource.id,
        name: schema.KnowledgeResource.name,
        description: schema.KnowledgeResource.description,
        book: sql<typeof Book>`
          CASE
            WHEN ${schema.Book.id} IS NOT NULL
            THEN json_build_object(
              'id', ${schema.Book.id},
              'name', ${schema.Book.title}
            )
            ELSE NULL
          END
        `.as("book"),
      },
    })
    .from(schema.CollectionItem)
    .where(eq(schema.CollectionItem.collectionId, collection.id))
    .leftJoin(
      schema.KnowledgeResource,
      eq(
        schema.CollectionItem.knowledgeResourceId,
        schema.KnowledgeResource.id,
      ),
    )
    .leftJoin(schema.Book, eq(schema.KnowledgeResource.bookId, schema.Book.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return {
    collection,
    items: {
      data: collectionItems,
      //   meta: { page, pageSize, total: totalCollections },
    },
  };
}

const retrieveUserCollection = cache(
  async ({ params, searchParams }: Props) => {
    const session = await auth();
    //    try {
    return await getUserCollectionBySlug({
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
  const { collection } = await retrieveUserCollection({ params, searchParams });

  return {
    title: `${collection.name} | ${collection.User.name}'s Collections`,
    openGraph: {
      title: `${collection.name} | ${collection.User.name}'s Collections`,
      url: config.url + "/" + params.username + "/collections/" + params.slug,
      siteName: config.siteName,
    },
  };
}

export default async function UserCollectionPage({
  params,
  searchParams,
}: Props) {
  const { collection, items } = await retrieveUserCollection({
    params,
    searchParams,
  });

  const user = collection.User;

  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <h1>
        {user.name}'s Collection - {collection.name}
      </h1>

      <pre>{JSON.stringify(collection, null, 2)}</pre>

      <pre>{JSON.stringify(items, null, 2)}</pre>
    </div>
  );
}
