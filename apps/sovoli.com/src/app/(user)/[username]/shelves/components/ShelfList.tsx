import Link from "next/link";
import { auth } from "@sovoli/auth";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/ui/card";

import type { GetKnowledges } from "~/services/knowledge/getKnowledges";
import { ShelfActions } from "./ShelfActions";

type Shelves = Awaited<ReturnType<GetKnowledges["call"]>>;

export interface ShelfListProps {
  shelves: Shelves["data"];
}

export function ShelfList({ shelves }: ShelfListProps) {
  return (
    <div className="flex flex-col gap-4">
      {shelves.map((shelf) => (
        <ShelfListItem key={shelf.id} shelf={shelf} />
      ))}
    </div>
  );
}

async function ShelfListItem({ shelf }: { shelf: Shelves["data"][0] }) {
  const session = await auth();
  return (
    <Card
      isFooterBlurred
      className="col-span-12 h-[300px] w-full sm:col-span-7"
    >
      <CardBody>
        <Link href={shelf.url}></Link>
      </CardBody>

      <CardFooter className="border-t-1 border-default-600 bg-black/40 dark:border-default-100">
        <Link href={shelf.url} className="flex flex-grow items-center gap-2">
          <div className="flex flex-col">
            <h4 className="text-xl font-medium text-white/90">{shelf.title}</h4>
            <p className="text-tiny text-white/60">{shelf.description}</p>
          </div>
        </Link>
        <ShelfActions id={shelf.id} ownerId={shelf.userId} session={session} />
      </CardFooter>
    </Card>
  );
}
