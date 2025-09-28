import type {
  SelectKnowledgeConnectionSchema,
  SelectKnowledgeSchema,
} from "@sovoli/db/schema";
import { Link } from "@sovoli/ui/components/link";
import { TimeAgo } from "@sovoli/ui/components/time-ago";

interface Props {
  knowledge: SelectKnowledgeSchema;
}
export function CollectionDetails({ knowledge }: Props) {
  return (
    <div>
      <Link href={`/${knowledge.User?.username}/${knowledge.slug}/connections`}>
        <h2>Collections</h2>
      </Link>
      <div className="h-full">
        {knowledge.SourceConnections?.map((connection, index) => {
          return <ConnectionItem item={connection} key={index} />;
        })}
      </div>
    </div>
  );
}

interface ConnectionItemProps {
  item: SelectKnowledgeConnectionSchema;
}
function ConnectionItem({ item }: ConnectionItemProps) {
  const knowledge = item.TargetKnowledge;
  if (!knowledge) {
    return <div>No target knowledge</div>;
  }
  const owner = knowledge.User;
  if (!owner) {
    return <div>No owner</div>;
  }
  return (
    <Link href={`/${owner.username}/${knowledge.slug}`}>
      <div className="border-border-300 h-full items-center rounded-xl border p-3">
        <div className="relative h-full w-40 rounded"></div>
        <div className="h-full justify-between">
          <p className="text-sm">
            {knowledge.type} - {item.type}
          </p>
          <h3>{knowledge.title}</h3>
          <p className="line-clamp-2">{knowledge.description}</p>
          <p>Notes: {item.notes}</p>
          <div>
            <TimeAgo
              datetime={knowledge.createdAt}
              className="text-typography-500 text-sm"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
