interface VolumeInfo {
  title: string;
  subtitle?: string;
  authors: string[];
  publishedDate: string;
  description: string;
  pageCount: number;
  categories: string[];
  industryIdentifiers?: {
    type: string;
    identifier: string;
  }[];
  imageLinks?: {
    smallThumbnail: string;
    thumbnail: string;
  };
}

interface BookItem {
  volumeInfo: VolumeInfo;
}

interface GoogleBooksApiResponse {
  items: BookItem[];
}

export interface GoogleBook {
  title: string;
  subtitle?: string;
  authors: string[];
  publishedDate: string;
  description: string;
  pageCount: number;
  categories: string[];
  isbn10: string | null;
  isbn13: string | null;
  thumbnail: string | null;
}

export async function getBooks(
  title: string,
  author: string | null,
  isbn: string | null
): Promise<GoogleBook[]> {
  let query = `intitle:${encodeURIComponent(title)}`;

  if (author) {
    query += `+inauthor:${encodeURIComponent(author)}`;
  }

  if (isbn) {
    query += `+isbn:${encodeURIComponent(isbn)}`;
  }

  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;

  try {
    //TODO: handle rate limit
    const response = await fetch(url);
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
      return {
        title: volumeInfo.title ?? "No title available",
        subtitle: volumeInfo.subtitle ?? "No subtitle available",
        authors: volumeInfo.authors ?? ["No authors available"],
        publishedDate: volumeInfo.publishedDate ?? "No date available",
        description: volumeInfo.description ?? "No description available",
        pageCount: volumeInfo.pageCount ?? 0,
        categories: volumeInfo.categories ?? ["No categories available"],
        isbn10,
        isbn13,
        thumbnail: volumeInfo.imageLinks
          ? volumeInfo.imageLinks.thumbnail
          : null,
      };
    });

    return books;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
