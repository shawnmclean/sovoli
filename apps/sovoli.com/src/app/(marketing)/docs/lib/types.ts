export interface DocMetadata {
  title: string;
  description: string;
  // Optional fields for future expansion
  order?: number;
  tags?: string[];
}

export type DocSection = "guides" | "reference";
