"use client";

import { Avatar } from "@sovoli/ui/components/avatar";
import { Link } from "@sovoli/ui/components/link";

interface ProgramSearchItemProps {
  program: {
    id: string;
    slug: string;
    name: string;
    ageRange?: string;
    imageUrl?: string;
  };
}

export function ProgramSearchItem({ program }: ProgramSearchItemProps) {
  return (
    <Link
      href={`programs/${program.slug}`}
      className="w-full text-left p-3 bg-default-100 hover:bg-default-200 rounded-lg transition-colors flex items-center gap-3 no-underline"
    >
      <Avatar
        radius="sm"
        src={program.imageUrl}
        name={program.name}
        size="md"
        className="flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{program.name}</div>
        {program.ageRange && (
          <div className="text-xs text-default-500 mt-1">
            Age: {program.ageRange}
          </div>
        )}
      </div>
    </Link>
  );
}
