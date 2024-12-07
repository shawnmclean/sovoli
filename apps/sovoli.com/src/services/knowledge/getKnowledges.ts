import type { SelectMediaAssetSchema } from "@sovoli/db/schema";
import { and, count, db, eq, inArray, or, schema, sql } from "@sovoli/db";
import { KnowledgeType } from "@sovoli/db/schema";

import { BaseService } from "../baseService";

export interface GetKnowledgesOptions {
  authUserId?: string;
  username: string;
  page?: number;
  pageSize?: number;
  type?: KnowledgeType;
}

export interface Knowledge {
  id: string;
  url: string;
  userId: string;
  slug: string | null;
  title: string | null;
  description: string | null;
  type: KnowledgeType;
  isOrigin: boolean;
  isPublic: boolean;
  content: string | null;
  createdAt: Date;
  updatedAt: Date;
  verifiedDate: string | null;
  totalBooks: number;
  totalConnections: number;

  MediaAssets: SelectMediaAssetSchema[];
}
export interface GetKnowledgesResult {
  data: Knowledge[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export class GetKnowledges extends BaseService<
  GetKnowledgesOptions,
  GetKnowledgesResult
> {
  async execute({
    authUserId,
    username,
    page = 1,
    pageSize = 30,
    type,
  }: GetKnowledgesOptions) {
    const usernameFilter = getByUsernameFilter(username);
    const privacyFilter = getPrivacyFilter(authUserId);
    const feedFilter = getFeedFilter();
    const typeFilter = getByTypeFilter(type);

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
            eq(
              schema.KnowledgeConnection.targetKnowledgeId,
              schema.Knowledge.id,
            ),
          )
          .groupBy(schema.KnowledgeConnection.sourceKnowledgeId),
      );

    const knowledges = await db
      .with(mediaAssetsSubquery, knowledgeConnectionSubquery)
      .select({
        id: schema.Knowledge.id,
        userId: schema.Knowledge.userId,
        slug: schema.Knowledge.slug,
        title: schema.Knowledge.title,
        description: schema.Knowledge.description,
        type: schema.Knowledge.type,
        content: schema.Knowledge.content,
        isOrigin: schema.Knowledge.isOrigin,
        isPublic: schema.Knowledge.isPublic,
        createdAt: schema.Knowledge.createdAt,
        updatedAt: schema.Knowledge.updatedAt,
        verifiedDate: schema.Knowledge.verifiedDate,
        // using a window function to count the number of collections matching the filter (ignoring pagination)
        totalItems: sql<number>`COUNT(*) OVER()`.as("totalItems"),
        // totalItems: knowledgeConnectionSubquery.totalItems,
        totalBooks: knowledgeConnectionSubquery.totalBooks,
        totalConnections: knowledgeConnectionSubquery.totalConnections,
        MediaAssets: sql<
          SelectMediaAssetSchema[]
        >`COALESCE(${mediaAssetsSubquery.mediaAssets}, '[]')`,
      })
      .from(schema.Knowledge)
      .where(and(usernameFilter, privacyFilter, feedFilter, typeFilter))
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

    // Extract total collections from the first collection (since it's duplicated in all rows)
    const totalItems = knowledges[0]?.totalItems ?? 0;

    // Remove totalCollections from individual collections
    const cleanedKnowledges = knowledges.map(({ totalItems: _, ...rest }) => ({
      ...rest,
      url: `/${username}/${rest.slug ?? rest.id}`,
    }));

    return {
      data: cleanedKnowledges,
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
function getFeedFilter() {
  return eq(schema.Knowledge.isOrigin, true);
}

function getByTypeFilter(type?: KnowledgeType) {
  if (!type) return;
  return eq(schema.Knowledge.type, type);
}
