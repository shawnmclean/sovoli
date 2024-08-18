interface VolumeInfo {
  title: string;
  subtitle?: string;
  authors: string[];
  publishedDate?: string;
  publisher: string;
  description: string;
  pageCount: number;
  categories: string[];
  industryIdentifiers?: {
    type: string;
    identifier: string;
  }[];
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
  };
  language: string;
}

interface BookItem {
  volumeInfo: VolumeInfo;
}

interface GoogleBooksApiResponse {
  items: BookItem[];
}

export interface GoogleBook {
  title: string;
  subtitle: string | null;
  authors: string[];
  publishedDate: Date | null;
  publisher: string;
  description: string;
  pageCount: number;
  categories: string[];
  isbn10: string | null;
  isbn13: string | null;
  thumbnail: string | null;
  language: string;
}

export interface SearchBooksQueryOptions {
  isbn?: string;
  /**
   * this can be a semantic search query that will use the embeddings to search for books
   */
  query?: string;
}

export async function searchGoogleBooks(
  options: SearchBooksQueryOptions,
  maxRetries = 5,
): Promise<GoogleBook[]> {
  let query = ``;

  // either query or isbn must be provided
  if (!options.query && !options.isbn) {
    throw new Error("query with title and author or isbn must be provided");
  }

  if (options.query) {
    query += encodeURIComponent(options.query);
  }

  if (options.isbn) {
    // Append ISBN search to the query. If there's already a query, add a plus sign to combine them.
    if (query) {
      query += `+`;
    }
    query += `isbn:${encodeURIComponent(options.isbn)}`;
  }

  const maxResults = 2;

  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;

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

      const data = (await response.json()) as GoogleBooksApiResponse;

      const books: GoogleBook[] = data.items.map((item: BookItem) => {
        const volumeInfo = item.volumeInfo;
        let isbn10: string | null = null;
        let isbn13: string | null = null;

        if (volumeInfo.industryIdentifiers) {
          for (const identifier of volumeInfo.industryIdentifiers) {
            if (identifier.type === "ISBN_10") {
              isbn10 = identifier.identifier;
            } else if (identifier.type === "ISBN_13") {
              isbn13 = identifier.identifier;
            }
          }
        }

        // Robust handling of publishedDate
        let publishedDate: Date | null = null;
        if (volumeInfo.publishedDate) {
          publishedDate = new Date(volumeInfo.publishedDate);
          // Check if the date is valid
          if (isNaN(publishedDate.getTime())) {
            publishedDate = null; // Handle invalid dates
          }
        }

        return {
          title: volumeInfo.title,
          subtitle: volumeInfo.subtitle ?? null,
          authors: volumeInfo.authors,
          // Do this to get rid of the time zone offset
          publishedDate: publishedDate,
          publisher: volumeInfo.publisher,
          description: volumeInfo.description,
          pageCount: volumeInfo.pageCount,
          categories: volumeInfo.categories,
          isbn10,
          isbn13,
          language: volumeInfo.language,
          thumbnail:
            volumeInfo.imageLinks?.thumbnail ??
            volumeInfo.imageLinks?.smallThumbnail ??
            null,
        };
      });

      return books; // Return books if successful
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

  throw new Error("Failed to fetch books after multiple attempts.");
}
