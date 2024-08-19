import type { SelectBookSchema } from "@sovoli/db/schema";
import { openai } from "@ai-sdk/openai";
import { cosineDistance, count, db, eq, gt, inArray, sql } from "@sovoli/db";
import { bookEmbeddings, books as booksTable } from "@sovoli/db/schema";
import { embedMany } from "ai";

export async function updateBookEmbeddings(bookIds: string[]) {
  const books = await db.query.books.findMany({
    with: {
      authorsToBooks: {
        with: {
          author: true,
        },
      },
    },
    where: inArray(booksTable.id, bookIds),
  });

  const bookTemplates = books.map(getBookEmbedTemplate);

  console.log(">>> bookTemplates", bookTemplates);
  const embeddings = await getOpenAIEmbeddings(bookTemplates);

  await setBookEmbeddings(
    books.map((book, index) => ({
      bookId: book.id,
      openAIEmbedding: embeddings[index] ?? [],
    })),
  );
}

function getBookEmbedTemplate(book: SelectBookSchema) {
  // Join the authors' names into a single string separated by commas
  const authorsList = book.authors?.map((author) => author.name).join(", ");

  return `
    Title: ${book.title}
    Subtitle: ${book.subtitle}
    Authors: ${authorsList ?? book.inferredAuthor}
    Publisher: ${book.publisher}
    Published Date: ${book.publishedDate}
    ISBN-13: ${book.isbn13}
    ISBN-10: ${book.isbn10}
    Language: ${book.language}
    Description: ${book.description}
    Page Count: ${book.pageCount}
  `;
}

async function setBookEmbeddings(
  data: { bookId: string; openAIEmbedding: number[] }[],
) {
  await db
    .insert(bookEmbeddings)
    .values(data)
    .onConflictDoUpdate({
      target: bookEmbeddings.bookId,
      set: {
        openAIEmbedding: sql.raw(
          `excluded.${bookEmbeddings.openAIEmbedding.name}`,
        ),
      },
    });
}
/**
 * Generates embeddings using OpenAI for the given templated strings.
 * @param queries - The list of templated strings.
 * @returns A list of generated embeddings.
 */
async function getOpenAIEmbeddings(
  bookTemplates: string[],
): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: bookTemplates,
  });

  return embeddings;
}

export async function getBooksByEmbeddings(
  embedding: number[],
  page = 1,
  pageSize = 10,
): Promise<{ data: SelectBookSchema[]; total: number }> {
  const similarity = sql<number>`1 - (${cosineDistance(bookEmbeddings.openAIEmbedding, embedding)})`;

  const [rows, totalResult] = await Promise.all([
    db
      .select({
        book: booksTable,
        similarity,
      })
      .from(bookEmbeddings)
      .innerJoin(booksTable, eq(bookEmbeddings.bookId, booksTable.id))
      .where(gt(similarity, 0.5))
      .orderBy(similarity)
      .offset((page - 1) * pageSize)
      .limit(pageSize),
    db
      .select({ count: count() })
      .from(bookEmbeddings)
      .innerJoin(booksTable, eq(bookEmbeddings.bookId, booksTable.id))
      .where(gt(similarity, 0.5)),
  ]);

  console.log(">>> rows", rows);

  const data = rows.map((row) => row.book); // Extract only the book data
  const total = totalResult[0]?.count ?? 0; // Extract the count from totalResult

  return {
    data,
    total,
  };
}
