export interface GoogleBook {
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  pageCount: number;
  categories: string[];
  averageRating: number;
  thumbnail: string | null;
}

async function getBooks(query: string): Promise<GoogleBook[]> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items) {
      throw new Error("No books found");
    }

    const books: GoogleBook[] = data.items.map((item: any) => {
      const volumeInfo = item.volumeInfo;
      return {
        title: volumeInfo.title || "No title available",
        authors: volumeInfo.authors || ["No authors available"],
        publisher: volumeInfo.publisher || "No publisher available",
        publishedDate: volumeInfo.publishedDate || "No date available",
        description: volumeInfo.description || "No description available",
        pageCount: volumeInfo.pageCount || 0,
        categories: volumeInfo.categories || ["No categories available"],
        averageRating: volumeInfo.averageRating || 0,
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
