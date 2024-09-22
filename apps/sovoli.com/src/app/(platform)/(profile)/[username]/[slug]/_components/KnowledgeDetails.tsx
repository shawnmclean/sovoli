import type { SelectKnowledgeSchema } from "@sovoli/db/schema";

import BookDetails from "./BookDetails";
import CollectionDetails from "./CollectionDetails";
import NoteDetails from "./NoteDetails";

interface Props {
  knowledge: SelectKnowledgeSchema;
}
export default function KnowledgeDetails({ knowledge }: Props) {
  switch (knowledge.type) {
    case "Book":
      return <BookDetails />;
    case "Collection":
      return <CollectionDetails />;
    case "Note":
      return <NoteDetails />;
  }
}
