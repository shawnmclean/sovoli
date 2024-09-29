import type { SelectKnowledgeSchema } from "@sovoli/db/schema";

interface Props {
  knowledge: SelectKnowledgeSchema;
}
export default function NoteDetails({ knowledge }: Props) {
  return (
    <div>
      <h1>Note: {knowledge.description}</h1>
    </div>
  );
}
