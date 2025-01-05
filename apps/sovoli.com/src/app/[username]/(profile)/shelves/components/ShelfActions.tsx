"use client";

import type { Session } from "next-auth";
import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@sovoli/ui/components/dropdown";
import { EllipsisIcon, PencilIcon, StarIcon, Trash2Icon } from "lucide-react";
import { tv } from "tailwind-variants";

import { MediaManagerDialog } from "./MediaManagerDialog";

export interface ShelfActionsProps {
  id: string;
  ownerId: string;
  session?: Session | null;
}

const dropdownIconStyles = tv({
  base: "text-xl text-default-500 pointer-events-none flex-shrink-0",
  variants: {
    variant: {
      danger: "text-danger",
    },
  },
});

export function ShelfActions({ id, ownerId, session }: ShelfActionsProps) {
  return (
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
      {ownerId === session?.userId ? <OwnerActions id={id} /> : null}
    </div>
  );
}

function OwnerActions({ id }: { id: string }) {
  const [isMediaManagerOpen, setIsMediaManagerOpen] = useState(false);
  return (
    <>
      {isMediaManagerOpen ? (
        <MediaManagerDialog
          knowledgeId={id}
          onClosed={() => setIsMediaManagerOpen(false)}
        />
      ) : null}

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
              key="edit-media"
              startContent={<PencilIcon className={dropdownIconStyles()} />}
              onPress={() => setIsMediaManagerOpen(true)}
            >
              Media
            </DropdownItem>
            <DropdownItem
              key="edit"
              startContent={<PencilIcon className={dropdownIconStyles()} />}
            >
              Edit
            </DropdownItem>
          </DropdownSection>
          <DropdownSection>
            <DropdownItem
              id={`delete-${id}`}
              key="delete"
              className="text-danger"
              color="danger"
              startContent={
                <Trash2Icon
                  className={dropdownIconStyles({ variant: "danger" })}
                />
              }
            >
              Delete
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
