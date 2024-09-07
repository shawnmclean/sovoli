export interface OpenLibraryLink {
  title: string;
  url: string;
  type?: {
    key: string;
  };
}

interface OpenLibraryAuthorResponse {
  key: string;
  name: string;
  title?: string; // "OBE"
  personal_name?: string; // "J. K. Rowling"
  fuller_name?: string; // "Joanne \"Jo\" Rowling"
  birth_date?: string; // "31 July 1965"
  death_date?: string; // If available
  bio?:
    | string
    | {
        value: string;
        type: string;
      };
  entity_type?: string; // "person"
  alternate_names?: string[]; // Array of alternate names
  photos?: number[]; // Array of photo IDs
  wikipedia?: string; // Wikipedia link
  remote_ids?: Record<string, string>; // For external IDs (e.g., "viaf", "goodreads", etc.)
  links?: OpenLibraryLink[]; // Array of links (e.g., Official site)
  source_records?: string[]; // Array of source records
  latest_revision?: number; // Latest revision number
  revision?: number; // Revision number
  created?: {
    type: string;
    value: string; // Date created
  };
  last_modified?: {
    type: string;
    value: string; // Date last modified
  };
}

export interface OpenLibraryAuthor {
  name: string;
  fullName: string | null;
  birthDate: Date | null;
  deathDate: Date | null;
  bio: string | null;
  alternateNames: string[];
  website: string | null;
}

export async function getAuthorByOLID(
  olid: string,
  maxRetries = 10,
): Promise<OpenLibraryAuthor | null> {
  if (!olid) {
    throw new Error("OLID must be provided");
  }

  const url = `https://openlibrary.org/authors/${olid}.json`;

  let retryCount = 0;
  let delay = 1000; // Start with a 1-second delay for retries

  while (retryCount < maxRetries) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "sovoli.com | github.com/shawnmclean/sovoli",
        },
      });
      if (response.status === 429) {
        // Rate limit hit, wait and retry
        retryCount++;
        console.warn(`Rate limit hit, retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue; // Retry the request
      }
      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as OpenLibraryAuthorResponse;

      const bio =
        typeof data.bio === "string" ? data.bio : (data.bio?.value ?? null);
      const website = data.links?.filter(
        (link) => link.type?.key === "/type/link",
      )[0];
      const author: OpenLibraryAuthor = {
        name: data.name,
        fullName: data.fuller_name ?? null,
        birthDate: data.birth_date ? new Date(data.birth_date) : null,
        deathDate: data.death_date ? new Date(data.death_date) : null,
        bio: bio,
        alternateNames: data.alternate_names ?? [],
        website: website?.url ?? null,
      };

      return author;
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

  throw new Error(
    `Failed to fetch author data after multiple attempts. OLID: ${olid}`,
  );
}
