import Link from "next/link";
import { Button, ButtonGroup } from "@sovoli/ui/components/ui/button";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/ui/card";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@sovoli/ui/components/ui/dropdown";
import { ChevronDownIcon } from "lucide-react";

import type { GetKnowledges } from "~/services/knowledge/getKnowledges";

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

function ShelfListItem({ shelf }: { shelf: Shelves["data"][0] }) {
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
        <ButtonGroup variant="flat" size="sm">
          <Button>Starred</Button>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly>
                <ChevronDownIcon />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Merge options"
              selectionMode="single"
              className="max-w-[300px]"
            >
              <DropdownItem key="merge">lol</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
