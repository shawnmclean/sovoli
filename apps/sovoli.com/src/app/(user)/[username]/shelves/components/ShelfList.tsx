"use client";

import Link from "next/link";
import { Button } from "@sovoli/ui/components/ui/button";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/ui/card";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@sovoli/ui/components/ui/dropdown";
import { EllipsisIcon, PencilIcon, StarIcon, Trash2Icon } from "lucide-react";
import { tv } from "tailwind-variants";

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

const dropdownIconStyles = tv({
  base: "text-xl text-default-500 pointer-events-none flex-shrink-0",
  variants: {
    variant: {
      danger: "text-danger",
    },
  },
});

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
        <div className="flex gap-4">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="flat" size="sm">
                <StarIcon />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Merge options"
              selectionMode="single"
              className="max-w-[300px]"
            >
              <DropdownItem key="merge">Add to collection</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="flat" size="sm">
                <EllipsisIcon />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Merge options"
              selectionMode="single"
              className="max-w-[300px]"
            >
              <DropdownSection showDivider>
                <DropdownItem
                  key="edit"
                  startContent={<PencilIcon className={dropdownIconStyles()} />}
                >
                  Edit file
                </DropdownItem>
              </DropdownSection>
              <DropdownSection>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={
                    <Trash2Icon
                      className={dropdownIconStyles({ variant: "danger" })}
                    />
                  }
                >
                  Delete file
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardFooter>
    </Card>
  );
}
