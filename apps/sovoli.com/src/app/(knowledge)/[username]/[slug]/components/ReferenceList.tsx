import type { KnowledgeConnection } from "@sovoli/db/schema";
import { Card, CardBody } from "@sovoli/ui/components/ui/card";
import { Chip } from "@sovoli/ui/components/ui/chip";
import { Image } from "@sovoli/ui/components/ui/image";

export interface ReferenceListProps {
  knowledgeConnections: KnowledgeConnection[];
}

export function ReferenceList({ knowledgeConnections }: ReferenceListProps) {
  return (
    <div className="flex flex-col gap-4">
      {knowledgeConnections.map((knowledgeConnection, index) => {
        return <ReferenceItem item={knowledgeConnection} key={index} />;
      })}
    </div>
  );
}

function ReferenceItem({ item }: { item: KnowledgeConnection }) {
  switch (item.TargetKnowledge?.type) {
    case "book":
      return <BookReference knowledgeConnection={item} />;
    default:
      return null;
  }
}

function BookReference({
  knowledgeConnection,
}: {
  knowledgeConnection: KnowledgeConnection;
}) {
  const book = knowledgeConnection.TargetKnowledge?.Book;
  const authors = book?.authors as unknown as string[];

  if (!book) return null;

  return (
    <Card className="border border-default-200">
      <CardBody className="flex flex-row gap-4">
        <Image
          alt={book.title}
          src={book.image ?? ""}
          className="object-cover"
          width={120}
          height={120}
        />
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h1 className="text-lg font-medium">{book.title}</h1>
            <p className="text-sm text-foreground/80">
              By {authors.join(", ")}
            </p>
          </div>
          <div className="inline-flex">
            <Chip
              size="sm"
              variant="faded"
              title="This note is a main reference to this book"
            >
              i
            </Chip>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
