import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import type { Metadata } from "next";
import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { auth } from "@sovoli/auth";
import { and, db, eq, inArray, or, schema, sql } from "@sovoli/db";
import { KnowledgeDetailsScreen } from "@sovoli/ui/screens/knowledge-details";

import { env } from "~/env";
import { config } from "~/utils/config";

export const dynamic = "force-dynamic";

interface BaseOptions {
  authUserId?: string;
}

interface PaginationFilter {
  page?: number;
  pageSize?: number;
}
interface GetKnowledgeBySlugOptions extends BaseOptions, PaginationFilter {
  username: string;
  slugOrId: string;
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

function getSlugOrIdFilter(slugOrId: string) {
  function isUUID(value: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  // Check if the slugOrId is a UUID
  if (isUUID(slugOrId)) {
    // If it's a UUID, search by ID
    return eq(schema.Knowledge.id, slugOrId);
  } else {
    // Otherwise, treat it as a slug
    return eq(schema.Knowledge.slug, slugOrId);
  }
}

async function getKnowledgeBySlug({
  username,
  slugOrId,
  authUserId,
  page = 1,
  pageSize = 30,
}: GetKnowledgeBySlugOptions) {
  const usernameFilter = getByUsernameFilter(username);
  const privacyFilter = getPrivacyFilter(authUserId);
  const slugFilter = getSlugOrIdFilter(slugOrId);

  const knowledgeResult = (await db.query.Knowledge.findFirst({
    with: {
      User: {
        columns: {
          id: true,
          username: true,
          name: true,
        },
      },
      MediaAssets: true,
      Book: true,
    },
    where: and(usernameFilter, privacyFilter, slugFilter),
  })) as SelectKnowledgeSchema | undefined;

  if (!knowledgeResult) throw Error("Knowledge not found");

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

  const connections = await db
    .with(mediaAssetsSubquery)
    .select({
      id: schema.KnowledgeConnection.id,
      notes: schema.KnowledgeConnection.notes,
      order: schema.KnowledgeConnection.order,
      type: schema.KnowledgeConnection.type,
      sourceKnowledgeId: schema.KnowledgeConnection.sourceKnowledgeId,
      targetKnowledgeId: schema.KnowledgeConnection.targetKnowledgeId,
      createdAt: schema.KnowledgeConnection.createdAt,
      updatedAt: schema.KnowledgeConnection.updatedAt,
      metadata: schema.KnowledgeConnection.metadata,
      totalItems: sql<number>`COUNT(*) OVER()`.as("totalItems"),
      SourceKnowledge: sql<SelectKnowledgeSchema | null>`NULL`,
      TargetKnowledge: sql<SelectKnowledgeSchema | null>`JSON_BUILD_OBJECT(
        'id', ${schema.Knowledge.id},
        'userId', ${schema.Knowledge.userId},
        'slug', ${schema.Knowledge.slug},
        'isOrigin', ${schema.Knowledge.isOrigin},
        'title', ${schema.Knowledge.title},
        'description', ${schema.Knowledge.description},
        'content', ${schema.Knowledge.content},
        'context', ${schema.Knowledge.context},
        'contextDescription', ${schema.Knowledge.contextDescription},
        'type', ${schema.Knowledge.type},
        'isPrivate', ${schema.Knowledge.isPrivate},
        'createdAt', ${schema.Knowledge.createdAt},
        'updatedAt', ${schema.Knowledge.updatedAt},
        'jobId', ${schema.Knowledge.jobId},
        'jobError', ${schema.Knowledge.jobError},
        'verifiedDate', ${schema.Knowledge.verifiedDate},
        'MediaAssets', COALESCE(${mediaAssetsSubquery.mediaAssets}, '[]'),
        'bookId', ${schema.Knowledge.bookId},
        'chapterNumber', ${schema.Knowledge.chapterNumber},
        'isPrivate', ${schema.Knowledge.isPrivate},
        'query', ${schema.Knowledge.query},
        'User', JSON_BUILD_OBJECT(
          'id', ${schema.User.id},
          'username', ${schema.User.username},
          'name', ${schema.User.name}
        ),
        'SourceConnections', json_build_array(),
        'Book', CASE
          WHEN ${schema.Book.id} IS NOT NULL THEN JSON_BUILD_OBJECT(
            'id', ${schema.Book.id},
            'title', ${schema.Book.title},
            'subtitle', ${schema.Book.subtitle},
            'description', ${schema.Book.description},
            'isbn13', ${schema.Book.isbn13},
            'isbn10', ${schema.Book.isbn10},
            'asin', ${schema.Book.asin},
            'editions', ${schema.Book.editions},
            'googleId', ${schema.Book.googleId},
            'olid', ${schema.Book.olid},
            'slug', ${schema.Book.slug},
            'publishedDate', ${schema.Book.publishedDate},
            'publisher', ${schema.Book.publisher},
            'pageCount', ${schema.Book.pageCount},
            'description', ${schema.Book.description},
            'language', ${schema.Book.language},
            'cover', ${schema.Book.cover},
            'triggerDevId', ${schema.Book.triggerDevId},
            'inferrenceError', ${schema.Book.inferrenceError},
            'lastGoogleUpdated', ${schema.Book.lastGoogleUpdated},
            'lastOLUpdated', ${schema.Book.lastOLUpdated},
            'inferredAuthor', ${schema.Book.inferredAuthor},
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
        eq(schema.KnowledgeConnection.sourceKnowledgeId, knowledgeResult.id),
      ),
    )
    .leftJoin(
      schema.Knowledge,
      eq(schema.KnowledgeConnection.targetKnowledgeId, schema.Knowledge.id),
    )
    .leftJoin(schema.User, eq(schema.Knowledge.userId, schema.User.id))
    .leftJoin(
      mediaAssetsSubquery,
      eq(mediaAssetsSubquery.knowledgeId, schema.Knowledge.id),
    )
    .leftJoin(schema.Book, eq(schema.Knowledge.bookId, schema.Book.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const totalItems = connections.length > 0 ? connections[0]?.totalItems : 0;

  // Remove totalCollections from individual collections and format dates
  const cleanedConnections = connections.map(({ totalItems: _, ...rest }) => {
    if (rest.SourceKnowledge) {
      rest.SourceKnowledge.createdAt = new Date(rest.SourceKnowledge.createdAt);
      rest.SourceKnowledge.updatedAt = new Date(rest.SourceKnowledge.updatedAt);

      rest.SourceKnowledge.MediaAssets?.forEach((mediaAsset) => {
        mediaAsset.createdAt = new Date(mediaAsset.createdAt);
        mediaAsset.updatedAt = new Date(mediaAsset.updatedAt);
      });
    }
    if (rest.TargetKnowledge) {
      rest.TargetKnowledge.createdAt = new Date(rest.TargetKnowledge.createdAt);
      rest.TargetKnowledge.updatedAt = new Date(rest.TargetKnowledge.updatedAt);

      rest.TargetKnowledge.MediaAssets?.forEach((mediaAsset) => {
        mediaAsset.createdAt = new Date(mediaAsset.createdAt);
        mediaAsset.updatedAt = new Date(mediaAsset.updatedAt);
      });
    }

    return rest;
  });
  knowledgeResult.SourceConnections = cleanedConnections;

  return {
    knowledge: knowledgeResult,
    meta: { page, pageSize, total: totalItems },
  };
}

interface Props {
  params: { username: string; slug: string };
  searchParams: { page: number | undefined; pageSize: number | undefined };
}

const retreiveKnowledgeBySlug = cache(
  async ({
    params: { username, slug },
    searchParams: { page, pageSize },
  }: Props) => {
    const session = await auth();

    // see: https://stackoverflow.com/questions/76191324/next-13-4-error-next-redirect-in-api-routes
    let redirectPath: string | null = null;
    try {
      const knowledgeResponse = await getKnowledgeBySlug({
        username: username,
        authUserId: session?.user?.id,
        slugOrId: slug,
        page,
        pageSize,
      });

      if (
        knowledgeResponse.knowledge.id === slug &&
        knowledgeResponse.knowledge.slug
      ) {
        redirectPath = `/${username}/${knowledgeResponse.knowledge.slug}`;
      }

      return knowledgeResponse;
    } catch (e) {
      console.log(JSON.stringify(e, null, 2));
      return notFound();
    } finally {
      if (redirectPath) {
        permanentRedirect(redirectPath);
      }
    }
  },
);

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { knowledge } = await retreiveKnowledgeBySlug({ params, searchParams });
  // Get the image path from the MediaAssets
  const image = knowledge.MediaAssets?.[0];

  // Construct the URL for the OpenGraph image using the Supabase public storage URL
  const imageUrl = image
    ? `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${image.bucket}/${image.path}`
    : undefined;
  return {
    title: `${knowledge.title} - ${knowledge.User?.name}`,
    openGraph: {
      title: `${knowledge.title} - ${knowledge.User?.name}`,
      url: config.url + "/" + params.username + "/" + knowledge.slug,
      siteName: config.siteName,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function KnowledgePage({ params, searchParams }: Props) {
  const { knowledge } = await retreiveKnowledgeBySlug({
    params,
    searchParams,
  });

  return <KnowledgeDetailsScreen knowledge={knowledge} />;
}
