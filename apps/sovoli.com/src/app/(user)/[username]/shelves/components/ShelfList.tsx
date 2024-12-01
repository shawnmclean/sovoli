import type { GetKnowledges } from "~/services/knowledge/getKnowledges";

type Shelves = Awaited<ReturnType<GetKnowledges["call"]>>;

export interface ShelfListProps {
  shelves: Shelves["data"];
}

export function ShelfList({ shelves }: ShelfListProps) {
  return (
    <div className="flex flex-col gap-4">
      {shelves.map((shelf) => (
        <a key={shelf.id} href={shelf.url}>
          <h2>{shelf.title}</h2>
        </a>
      ))}
    </div>
  );
}
