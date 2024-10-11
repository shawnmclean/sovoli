import type { Metadata } from "next";
import { cache } from "react";
// import { notFound } from "next/navigation";
import { and, db, desc, eq, lt, or, schema } from "@sovoli/db";

import { config } from "~/utils/config";

export const dynamic = "force-dynamic";

interface BaseOptions {
  authUserId?: string;
}
interface GetLatestKnowledgesOptions extends BaseOptions {
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

async function getLatestKnowledges({
  cursor,
  limit = 10,
}: GetLatestKnowledgesOptions = {}) {
  const feedFilter = getFeedFilter();

  return db.query.Knowledge.findMany({
    columns: {
      id: true,
      slug: true,
      title: true,
      description: true,
      type: true,
      content: true,
      createdAt: true,
    },
    with: {
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
}

const retrieveLatestKnowledges = cache(async () => {
  // try {
  return await getLatestKnowledges();
  // } catch {
  //   return notFound();
  // }
});

export function generateMetadata(): Metadata {
  return {
    title: `Feed`,
    openGraph: {
      title: `$Feed`,
      url: config.url + "/feed/",
      siteName: config.siteName,
    },
  };
}

export default async function FeedPage() {
  const knowledges = await retrieveLatestKnowledges();

  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <h1>Feed</h1>

      <div>
        {knowledges.map((knowledge) => (
          <a
            key={knowledge.id}
            href={`/${knowledge.User.username}/${knowledge.slug ?? knowledge.id}`}
          >
            <h2>{knowledge.title}</h2>
            <p>
              {knowledge.User.name} - {knowledge.User.type}
            </p>
            <p>{knowledge.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
