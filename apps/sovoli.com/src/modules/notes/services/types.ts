import type { Photo } from "~/modules/core/photos/types";

export interface KnowledgeFile {
  id: string;
  title: string;
  description: string;
  type: "note" | "book" | "collection" | "shelf";
  content: string;
  slug: string;
  isOrigin: boolean;
  isPublic: boolean;
  isDraft: boolean;
  chapterNumber?: number;
  verifiedDate?: string;
  query?: string;
  queryType: "query" | "isbn";
  createdAt: string;
  updatedAt: string;
  userId: string;
  coverPhoto?: Photo;
  inlinePhotos: Photo[];
}

export interface UserKnowledge {
  username: string;
  knowledgeItems: KnowledgeFile[];
}

export interface UserSlug {
  username: string;
  slug: string;
}
