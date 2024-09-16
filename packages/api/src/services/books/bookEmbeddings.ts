import type { SelectBookSchema } from "@sovoli/db/schema";
import { openai } from "@ai-sdk/openai";
import { cosineDistance, count, db, eq, gt, inArray, sql } from "@sovoli/db";
import { Book, BookEmbedding } from "@sovoli/db/schema";
import { embedMany } from "ai";

export async function updateBookEmbeddings(bookIds: string[]) {
  const books = await db.query.Book.findMany({
    with: {
      authorsToBooks: {
        with: {
          author: true,
        },
      },
    },
    where: inArray(Book.id, bookIds),
  });

  const bookTemplates = books.map(getBookEmbedTemplate);

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
  // Important: This section describes the book titled '${book.title}' authored primarily by ${authorsList ?? book.inferredAuthor}.
  Title: ${book.title}
  Subtitle: ${book.subtitle}
  
  // Note: The following are the authors of this book.
  Authors: ${authorsList ?? book.inferredAuthor}
  Authors Repeated: ${authorsList ?? book.inferredAuthor} (Primary Author: ${authorsList ?? book.inferredAuthor?.split(",")[0]})
  
  Publisher: ${book.publisher}
  Published Date: ${book.publishedDate}
  
  // Identifier Information:
  ISBN-13: ${book.isbn13}
  ISBN-10: ${book.isbn10}
  
  // Language of the text:
  Language: ${book.language}
  
  // Book Description:
  Description: ${book.description}
  Description (with Author context): ${book.description} This important work is authored by ${authorsList ?? book.inferredAuthor}, providing key insights into the subject of ${book.title}.
  
  // Physical attributes of the book:
  Page Count: ${book.pageCount}

  // End of Metadata

`;
}

async function setBookEmbeddings(
  data: { bookId: string; openAIEmbedding: number[] }[],
) {
  await db
    .insert(BookEmbedding)
    .values(data)
    .onConflictDoUpdate({
      target: BookEmbedding.bookId,
      set: {
        openAIEmbedding: sql.raw(
          `excluded.${BookEmbedding.openAIEmbedding.name}`,
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
  const similarity = sql<number>`1 - (${cosineDistance(BookEmbedding.openAIEmbedding, embedding)})`;

  const [rows, totalResult] = await Promise.all([
    db
      .select({
        book: Book,
        similarity,
      })
      .from(BookEmbedding)
      .innerJoin(Book, eq(BookEmbedding.bookId, Book.id))
      .where(gt(similarity, 0.5))
      .orderBy(similarity)
      .offset((page - 1) * pageSize)
      .limit(pageSize),
    db
      .select({ count: count() })
      .from(BookEmbedding)
      .innerJoin(Book, eq(BookEmbedding.bookId, Book.id))
      .where(gt(similarity, 0.5)),
  ]);

  const data = rows.map((row) => row.book); // Extract only the book data
  const total = totalResult[0]?.count ?? 0; // Extract the count from totalResult

  return {
    data,
    total,
  };
}
