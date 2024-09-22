import type { SelectKnowledgeSchema } from "@sovoli/db/schema";

import BookDetails from "./BookDetails";
import CollectionDetails from "./CollectionDetails";
import NoteDetails from "./NoteDetails";

interface Props {
  knowledge: SelectKnowledgeSchema;
}
export default function KnowledgeDetails({ knowledge }: Props) {
  return (
    <div>
      <h1>{knowledge.name}</h1>
      <p>{knowledge.description}</p>
      <KnowledgeComponentSwitcher knowledge={knowledge} />
    </div>
  );
}

function KnowledgeComponentSwitcher({ knowledge }: Props) {
  switch (knowledge.type) {
    case "Book":
      return <BookDetails knowledge={knowledge} />;
    case "Collection":
      return <CollectionDetails knowledge={knowledge} />;
    case "Note":
      return <NoteDetails knowledge={knowledge} />;
  }
}
