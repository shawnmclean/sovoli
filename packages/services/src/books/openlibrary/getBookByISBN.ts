interface OpenLibraryAuthor {
  url: string;
  name: string;
}

interface OpenLibraryIdentifiers {
  isbn_13?: string[];
  isbn_10?: string[];
  openlibrary?: string[];
}

interface OpenLibraryPublisher {
  name: string;
}

export interface OpenLibraryCover {
  small?: string;
  medium?: string;
  large?: string;
}

interface OpenLibrarySubject {
  name: string;
  url: string;
}

interface OpenLibrarySubjectPlace {
  name: string;
  url: string;
}

interface OpenLibrarySubjectPerson {
  name: string;
  url: string;
}

interface OpenLibraryExcerpt {
  text: string;
  comment: string;
}

interface OpenLibraryLink {
  title: string;
  url: string;
}

interface OpenLibraryData {
  url: string;
  key: string;
  title: string;
  authors: OpenLibraryAuthor[];
  identifiers: OpenLibraryIdentifiers;
  publishers: OpenLibraryPublisher[];
  publish_date: string;
  subjects?: OpenLibrarySubject[];
  subject_places: OpenLibrarySubjectPlace[];
  subject_people: OpenLibrarySubjectPerson[];
  excerpts: OpenLibraryExcerpt[];
  links: OpenLibraryLink[];
  cover?: OpenLibraryCover;
}

interface OpenLibraryDetails {
  bib_key: string;
  info_url: string;
  preview: string;
  preview_url: string;
  thumbnail_url: string;
  details: {
    works: { key: string }[];
    title: string;
    publishers: string[];
    publish_date: string;
    key: string;
    type: { key: string };
    identifiers: OpenLibraryIdentifiers;
    covers: number[];
    isbn_13: string[];
    classifications: Record<string, unknown>;
    source_records: string[];
    latest_revision: number;
    revision: number;
    created: { type: string; value: string };
    last_modified: { type: string; value: string };
  };
}

interface OpenLibraryRecord {
  isbns: string[];
  issns: string[];
  lccns: string[];
  oclcs: string[];
  olids: string[];
  publishDates: string[];
  recordURL: string;
  data: OpenLibraryData;
  details: OpenLibraryDetails;
}

interface OpenLibraryResponse {
  records: Record<string, OpenLibraryRecord>;
  /**
   * No idea what this is, but the response returns it empty
   */
  items: unknown[];
}

export interface OpenLibraryBook {
  title: string;
  authors: { name: string; olid: string | null }[];
  publishedDate: Date | null;
  publisher: string;
  olid: string;
  isbn13: string | null;
  isbn10: string | null;
  itemURL: string;
  cover?: OpenLibraryCover;
}
export async function getBookByISBN(
  isbn: string,
  maxRetries = 10,
): Promise<OpenLibraryBook | null> {
  if (!isbn) {
    throw new Error("ISBN must be provided");
  }

  const url = `http://openlibrary.org/api/volumes/brief/isbn/${encodeURIComponent(isbn)}.json`;

  let retryCount = 0;
  let delay = 1000; // Start with a 1-second delay for retries

  while (retryCount < maxRetries) {
    try {
      const response = await fetch(url);

      if (response.status === 429) {
        // Rate limit hit, wait and retry
        retryCount++;
        console.warn(`Rate limit hit, retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue; // Retry the request
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as OpenLibraryResponse;

      // Assuming there's only one record for the given ISBN
      const record = Object.values(data.records)[0];
      if (!record) {
        return null;
      }

      const { data: bookData } = record;

      // Robust handling of publishedDate
      let publishedDate: Date | null = null;
      if (bookData.publish_date) {
        publishedDate = new Date(bookData.publish_date);
        // Check if the date is valid
        if (isNaN(publishedDate.getTime())) {
          publishedDate = null; // Handle invalid dates
        }
      }

      // Handle authors
      const authors = bookData.authors.map((author) => {
        return {
          name: author.name,
          olid: extractAuthorId(author.url) ?? null,
        };
      });

      // Extract data and map to OpenLibraryBook
      const book: OpenLibraryBook = {
        title: bookData.title,
        authors: authors,
        publishedDate: publishedDate,
        publisher: bookData.publishers[0]?.name ?? "",
        isbn13: bookData.identifiers.isbn_13?.[0] ?? null,
        isbn10: bookData.identifiers.isbn_10?.[0] ?? null,
        olid: bookData.identifiers.openlibrary?.[0] ?? "",
        cover: bookData.cover,
        itemURL: bookData.url,
      };

      return book;
    } catch (error) {
      if (retryCount >= maxRetries) {
        console.error("Max retries reached. Could not fetch data.");
        throw error;
      }

      console.error(
        `Error occurred, retrying (${retryCount}/${maxRetries})...`,
        error,
      );
      retryCount++;
    }
  }

  throw new Error("Failed to fetch book data after multiple attempts.");
}

function extractAuthorId(url: string): string | null {
  const parts = url.split("/");
  // The author ID is the part after "/authors/"
  const authorIdIndex = parts.indexOf("authors") + 1;

  if (authorIdIndex > 0 && authorIdIndex < parts.length) {
    const authorId = parts[authorIdIndex];
    return authorId ? authorId : null; // Explicitly return null if authorId is undefined or empty
  }

  return null; // Return null if "authors" is not found or if the index is out of bounds
}
