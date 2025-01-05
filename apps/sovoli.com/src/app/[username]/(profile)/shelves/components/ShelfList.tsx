import Image from "next/image";
import Link from "next/link";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { LibraryBigIcon } from "lucide-react";

import type { GetKnowledges } from "~/services/knowledge/getKnowledges";
import { auth } from "~/core/auth";
import supabaseLoader from "~/loaders/supabaseImageLoader";
import { ShelfActions } from "./ShelfActions";

type Shelves = Awaited<ReturnType<GetKnowledges["call"]>>;
type ShelfItem = Shelves["data"][number];

export interface ShelfListProps {
  shelves: ShelfItem[];
}

export function ShelfList({ shelves }: ShelfListProps) {
  return (
    <div className="flex flex-col gap-5">
      {shelves.map((shelf) => (
        <ShelfListItem key={shelf.id} shelf={shelf} />
      ))}
    </div>
  );
}

async function ShelfListItem({ shelf }: { shelf: ShelfItem }) {
  const session = await auth();
  return (
    <Card
      isFooterBlurred
      className="col-span-12 h-[300px] w-full sm:col-span-7"
    >
      <CardBody className="flex grow">
        <Link href={shelf.url} className="flex h-full w-full">
          {shelf.MediaAssets[0]?.path ? (
            <Image
              src={`${shelf.MediaAssets[0].bucket}/${shelf.MediaAssets[0].path}`}
              alt={shelf.title ?? "Shelf cover"}
              fill
              className="h-full w-full object-cover"
              loader={supabaseLoader}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <LibraryBigIcon className="h-20 w-20 text-gray-400" />
            </div>
          )}
        </Link>
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
