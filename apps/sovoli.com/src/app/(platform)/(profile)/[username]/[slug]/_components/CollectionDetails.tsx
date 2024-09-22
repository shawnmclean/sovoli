import type { SelectKnowledgeSchema } from "@sovoli/db/schema";

interface Props {
  knowledge: SelectKnowledgeSchema;
}
export default function CollectionDetails({ knowledge }: Props) {
  return (
    <div>
      <h1>Collection Details</h1>

      <pre>{JSON.stringify(knowledge, null, 2)}</pre>
    </div>
  );
}
