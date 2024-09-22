import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { KnowledgeType } from "@sovoli/db/schema";

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
    case KnowledgeType.Book:
      return <BookDetails knowledge={knowledge} />;
    case KnowledgeType.Collection:
      return <CollectionDetails knowledge={knowledge} />;
    case KnowledgeType.Note:
      return <NoteDetails knowledge={knowledge} />;
  }
}
