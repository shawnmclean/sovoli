"use client";

import { Button } from "@sovoli/ui/components/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@sovoli/ui/components/dropdown";
import { ChevronDownIcon, FilePlusIcon, LibraryIcon } from "lucide-react";

export const NewDropdown = () => {
  const iconClasses = "text-xl text-default-500 pointer-events-none shrink-0";
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" endContent={<ChevronDownIcon />}>
          New
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="New Menu" variant="flat">
        <DropdownItem
          key="post"
          href="/new"
          showDivider
          startContent={<FilePlusIcon className={iconClasses} />}
        >
          New Post
        </DropdownItem>
        <DropdownItem
          key="import"
          href="/new/import"
          startContent={<LibraryIcon className={iconClasses} />}
        >
          Import Books
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
