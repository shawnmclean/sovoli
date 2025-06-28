"use client";

import { Button } from "@sovoli/ui/components/button";
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import Link from "next/link";

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({
  placeholder = "Private Schools in Guyana",
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 w-full">
      <Button
        variant="shadow"
        radius="md"
        size="sm"
        className="flex-1 justify-start"
        href="/d/private-school/guyana"
        startContent={<SearchIcon size={16} />}
        disableAnimation
        as={Link}
      >
        {placeholder}
      </Button>

      <Button
        isIconOnly
        variant="light"
        size="sm"
        href="/d/private-school/guyana"
        as={Link}
      >
        <SlidersHorizontalIcon size={16} />
      </Button>
    </div>
  );
}
