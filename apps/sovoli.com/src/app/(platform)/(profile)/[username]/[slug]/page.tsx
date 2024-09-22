import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { cache } from "react";
import { auth } from "@sovoli/auth";
import { and, db, eq, inArray, or, schema, sql } from "@sovoli/db";

import KnowledgeDetails from "./_components/KnowledgeDetails";

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

  const knowledgeResult = await db.query.Knowledge.findFirst({
    with: {
      User: {
        columns: {
          id: true,
          name: true,
          username: true,
        },
      },
      KnowledgeMediaAssets: {
        with: {
          MediaAsset: true,
        },
      },
    },
    where: and(usernameFilter, privacyFilter, slugFilter),
  });
  if (!knowledgeResult) throw Error("Knowledge not found");
  // Destructure to extract the user and the rest of the knowledge
  const { User: user, ...knowledge } = knowledgeResult;

  const mediaAssetsSubquery = db.$with("media_assets_subquery").as(
    db
      .select({
        knowledgeId: schema.KnowledgeMediaAsset.knowledgeId,
        mediaAssets: sql`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${schema.KnowledgeMediaAsset.id},
              'MediaAsset', JSON_BUILD_OBJECT(
                'id', ${schema.MediaAsset.id},
                'host', ${schema.MediaAsset.host},
                'bucket', ${schema.MediaAsset.bucket},
                'path', ${schema.MediaAsset.path},
                'createdAt', ${schema.MediaAsset.createdAt},
                'updatedAt', ${schema.MediaAsset.updatedAt}
              )
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

  const connections = await db
    .with(mediaAssetsSubquery)
    .select({
      id: schema.KnowledgeConnection.id,
      notes: schema.KnowledgeConnection.notes,
      order: schema.KnowledgeConnection.order,
      sourceKnowledgeId: schema.KnowledgeConnection.sourceKnowledgeId,
      targetKnowledgeId: schema.KnowledgeConnection.targetKnowledgeId,
      createdAt: schema.KnowledgeConnection.createdAt,
      updatedAt: schema.KnowledgeConnection.updatedAt,
      SourceKnowledge: sql<SelectKnowledgeSchema>`NULL`,
      TargetKnowledge: sql<SelectKnowledgeSchema>`JSON_BUILD_OBJECT(
        'id', ${schema.Knowledge.id},
        'slug', ${schema.Knowledge.slug},
        'name', ${schema.Knowledge.name},
        'description', ${schema.Knowledge.description},
        'type', ${schema.Knowledge.type},
        'isPrivate', ${schema.Knowledge.isPrivate},
        'createdAt', ${schema.Knowledge.createdAt},
        'updatedAt', ${schema.Knowledge.updatedAt},
        'KnowledgeMediaAssets', COALESCE(${mediaAssetsSubquery.mediaAssets}, '[]'),
        'Book', CASE
          WHEN ${schema.Book.id} IS NOT NULL THEN JSON_BUILD_OBJECT(
            'id', ${schema.Book.id},
            'title', ${schema.Book.title},
            'description', ${schema.Book.description},
            'isbn13', ${schema.Book.isbn13},
            'createdAt', ${schema.Book.createdAt},
            'updatedAt', ${schema.Book.updatedAt}
          )
          ELSE NULL
        END
      )
      `,
    })
    .from(schema.KnowledgeConnection)
    .where(
      and(
        privacyFilter,
        // where the parent is the knowledge we are looking for
        eq(schema.KnowledgeConnection.sourceKnowledgeId, knowledge.id),
      ),
    )
    .leftJoin(
      schema.Knowledge,
      eq(schema.KnowledgeConnection.targetKnowledgeId, schema.Knowledge.id),
    )
    .leftJoin(
      mediaAssetsSubquery,
      eq(mediaAssetsSubquery.knowledgeId, schema.Knowledge.id),
    )
    .leftJoin(schema.Book, eq(schema.Knowledge.bookId, schema.Book.id));

  return {
    user,
    knowledge: {
      ...knowledge,
      Connections: connections,
    },
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
  const { knowledge } = await retreiveKnowledgeBySlug({
    params,
  });

  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <a href={`/${params.username}`}>Back to {params.username}</a>

      <KnowledgeDetails knowledge={knowledge} />
    </div>
  );
}
