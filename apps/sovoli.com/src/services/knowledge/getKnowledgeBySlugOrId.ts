import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { and, db, desc, eq, inArray, or, schema, sql } from "@sovoli/db";

import { BaseService } from "../baseService";

export interface GetKnowledgeBySlugOrIdOptions {
  username: string;
  slugOrId: string;
  authUserId?: string;
  page?: number;
  pageSize?: number;
}

export interface GetKnowledgeBySlugOrIdResult {
  knowledge?: SelectKnowledgeSchema | null;
  meta: { page: number; pageSize: number; total: number };
}

export class GetKnowledgeBySlugOrId extends BaseService<
  GetKnowledgeBySlugOrIdOptions,
  GetKnowledgeBySlugOrIdResult
> {
  constructor() {
    super("GetKnowledgeBySlugOrId");
  }

  async execute({
    username,
    slugOrId,
    authUserId,
    page = 1,
    pageSize = 30,
  }: GetKnowledgeBySlugOrIdOptions) {
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
        KnowledgeMediaAssets: {
          with: { MediaAsset: true },
        },
        Book: true,
      },
      where: and(usernameFilter, privacyFilter, slugFilter),
    })) as SelectKnowledgeSchema | undefined;

    if (!knowledgeResult)
      return {
        knowledge: null,
        meta: { page, pageSize, total: 0 },
      };

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
          'type', ${schema.Knowledge.type},
          'isPublic', ${schema.Knowledge.isPublic},
          'createdAt', ${schema.Knowledge.createdAt},
          'updatedAt', ${schema.Knowledge.updatedAt},
          'jobId', ${schema.Knowledge.jobId},
          'jobError', ${schema.Knowledge.jobError},
          'verifiedDate', ${schema.Knowledge.verifiedDate},
          'MediaAssets', COALESCE(${mediaAssetsSubquery.mediaAssets}, '[]'),
          'bookId', ${schema.Knowledge.bookId},
          'chapterNumber', ${schema.Knowledge.chapterNumber},
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
              'image', ${schema.Book.image},
              'editions', ${schema.Book.editions},
              'googleId', ${schema.Book.googleId},
              'olid', ${schema.Book.olid},
              'slug', ${schema.Book.slug},
              'publishedDate', ${schema.Book.publishedDate},
              'publisher', ${schema.Book.publisher},
              'pageCount', ${schema.Book.pageCount},
              'description', ${schema.Book.description},
              'language', ${schema.Book.language},
              'triggerDevId', ${schema.Book.triggerDevId},
              'inferrenceError', ${schema.Book.inferrenceError},
              'lastGoogleUpdated', ${schema.Book.lastGoogleUpdated},
              'authors', ${schema.Book.authors},
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
      .orderBy(desc(schema.KnowledgeConnection.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const totalItems =
      connections.length > 0 ? (connections[0]?.totalItems ?? 0) : 0;

    // Remove totalCollections from individual collections and format dates
    const cleanedConnections = connections.map(({ totalItems: _, ...rest }) => {
      if (rest.SourceKnowledge) {
        rest.SourceKnowledge.createdAt = new Date(
          rest.SourceKnowledge.createdAt,
        );
        rest.SourceKnowledge.updatedAt = new Date(
          rest.SourceKnowledge.updatedAt,
        );

        rest.SourceKnowledge.MediaAssets?.forEach((mediaAsset) => {
          mediaAsset.createdAt = new Date(mediaAsset.createdAt);
          mediaAsset.updatedAt = new Date(mediaAsset.updatedAt);
        });
      }
      if (rest.TargetKnowledge) {
        rest.TargetKnowledge.createdAt = new Date(
          rest.TargetKnowledge.createdAt,
        );
        rest.TargetKnowledge.updatedAt = new Date(
          rest.TargetKnowledge.updatedAt,
        );

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
  const isPrivate = eq(schema.Knowledge.isPublic, true);
  if (!authUserId) return isPrivate;

  // if the user is authenticated, include private collections only if the user is the owner
  return or(
    isPrivate,
    and(
      eq(schema.Knowledge.isPublic, false),
      eq(schema.Knowledge.userId, authUserId),
    ),
  );
}

function getSlugOrIdFilter(slugOrId: string) {
  return or(
    eq(schema.Knowledge.slug, slugOrId),
    eq(schema.Knowledge.id, slugOrId),
  );
}
