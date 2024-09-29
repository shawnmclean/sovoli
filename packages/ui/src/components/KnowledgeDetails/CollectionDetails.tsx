import type { SelectKnowledgeSchema } from "@sovoli/db/schema";

interface Props {
  knowledge: SelectKnowledgeSchema;
}
export default function CollectionDetails({ knowledge }: Props) {
  return (
    <div>
      <h1>Collection Details {knowledge.description}</h1>
    </div>
  );
}
