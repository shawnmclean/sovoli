import type { SelectAuthorSchema } from "@sovoli/db/schema";
import { db, eq } from "@sovoli/db";
import { Author } from "@sovoli/db/schema";
import { bookService } from "@sovoli/services";
import { AbortTaskRunError, logger, task } from "@trigger.dev/sdk/v3";

export interface HydrateAuthorOptions {
  authorId: string;
}

export const hydrateAuthor = task({
  id: "hydrate-author",
  run: async ({ authorId }: HydrateAuthorOptions, { ctx }) => {
    const authors = await db
      .update(Author)
      .set({
        triggerDevId: ctx.run.id,
      })
      .where(eq(Author.id, authorId))
      .returning();

    const author = authors[0];
    if (!author) {
      logger.error(`Author not found for authorId: ${authorId}`);
      return;
    }

    const updatedAuthor = await hydrateAuthorFromOpenLibrary(author);

    if (!updatedAuthor) {
      logger.error(`Author was not hydrated for authorId: ${authorId}`);
      return;
    }

    logger.info(`Updated author: ${updatedAuthor.id}`);
  },
});

async function hydrateAuthorFromOpenLibrary(author: SelectAuthorSchema) {
  if (!isOLDataStale(author)) {
    logger.info(
      `Author is not stale, not hydrating author from openlibrary: ${author.id}`,
    );
    return;
  }

  if (!author.olid) {
    throw new AbortTaskRunError(`Author has no OLID: ${author.id}`);
  }

  logger.info(`Hydrating author from openlibrary: ${author.id}`);

  const olAuthor = await bookService.openlibrary.getAuthorByOLID(author.olid);

  if (!olAuthor) {
    throw new AbortTaskRunError(`Author not found for OLID: ${author.olid}`);
  }

  const updatedAuthor = await updateAuthorFromOpenLibrary(author.id, olAuthor);

  logger.info(`Hydrated author from openlibrary: ${updatedAuthor.id}`);

  return updatedAuthor;
}

async function updateAuthorFromOpenLibrary(
  authorId: string,
  author: bookService.openlibrary.OpenLibraryAuthor,
) {
  const insertedAuthors = await db
    .update(Author)
    .set({
      name: author.name,
      fullName: author.fullName,
      bio: author.bio,
      birthDate: author.birthDate?.toISOString(),
      deathDate: author.deathDate?.toISOString(),
      website: author.website,
      alternateNames: author.alternateNames,
      lastOLUpdated: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(Author.id, authorId))
    .returning();

  if (!insertedAuthors[0]) {
    logger.error(`Author not found for authorId: ${authorId}`);
    throw new Error(`Author not found for authorId: ${authorId}`);
  }

  return insertedAuthors[0];
}

const THREE_MONTHS_IN_MS = 1000 * 60 * 60 * 24 * 30 * 3;

function isOLDataStale(author: SelectAuthorSchema) {
  const { lastOLUpdated } = author;

  const lastOLUpdatedTime = lastOLUpdated
    ? new Date(lastOLUpdated).getTime()
    : 0;

  return lastOLUpdatedTime < Date.now() - THREE_MONTHS_IN_MS;
}
