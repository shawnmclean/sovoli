import type { SQL } from "@sovoli/db";
import { db, inArray, schema, sql } from "@sovoli/db";
import { knowledgeConnectionTypeEnum } from "@sovoli/db/schema";

import type { UpdateConnectionSchema } from "../../tsr/router/knowledge/knowledgeContract";

export interface UpdateConnectionsOptions {
  connections: UpdateConnectionSchema[];
}

export const updateConnections = async ({
  connections,
}: UpdateConnectionsOptions) => {
  if (connections.length === 0) {
    return [];
  }

  const ids: string[] = connections.map((input) => input.id);

  const sqlChunksForNotes: SQL[] = [sql`(case`];
  const sqlChunksForType: SQL[] = [sql`(case`];
  const sqlChunksForMetadata: SQL[] = [sql`(case`];

  for (const input of connections) {
    if (input.notes !== undefined) {
      sqlChunksForNotes.push(
        sql`when ${schema.KnowledgeConnection.id} = ${input.id} then ${input.notes}`,
      );
    }

    if (input.type !== undefined) {
      sqlChunksForType.push(
        sql`when ${schema.KnowledgeConnection.id} = ${input.id} then ${input.type}::${sql.raw(knowledgeConnectionTypeEnum.enumName)}`,
      );
    }

    if (input.metadata !== undefined) {
      sqlChunksForMetadata.push(
        sql`when ${schema.KnowledgeConnection.id} = ${input.id} then ${input.metadata}::jsonb`,
      );
    }
  }

  sqlChunksForNotes.push(sql`end)`);
  sqlChunksForType.push(sql`end)`);
  sqlChunksForMetadata.push(sql`end)`);

  // join the chunks, if there less than 3, (case and end) then keep as undefined so we don't set that
  const finalNotesSql =
    sqlChunksForNotes.length > 2
      ? sql.join(sqlChunksForNotes, sql.raw(" "))
      : undefined;
  const finalTypeSql =
    sqlChunksForType.length > 2
      ? sql.join(sqlChunksForType, sql.raw(" "))
      : undefined;
  const finalMetadataSql =
    sqlChunksForMetadata.length > 2
      ? sql.join(sqlChunksForMetadata, sql.raw(" "))
      : undefined;

  const updatedKnowledgeConnections = await db
    .update(schema.KnowledgeConnection)
    .set({
      notes: finalNotesSql,
      type: finalTypeSql,
      metadata: finalMetadataSql,
    })
    .where(inArray(schema.KnowledgeConnection.id, ids))
    .returning();

  return updatedKnowledgeConnections;
};
