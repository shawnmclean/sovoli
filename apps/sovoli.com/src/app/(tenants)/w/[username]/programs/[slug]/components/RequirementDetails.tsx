"use client";

import {
  PackageIcon,
  BookOpenIcon,
  DropletsIcon,
  ShirtIcon,
} from "lucide-react";
import type { Program, RequirementList } from "~/modules/academics/types";

interface RequirementDetailsProps {
  program: Program;
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "booklist":
      return <BookOpenIcon className="h-4 w-4" />;
    case "materials":
      return <PackageIcon className="h-4 w-4" />;
    case "hygiene":
      return <DropletsIcon className="h-4 w-4" />;
    case "uniform":
      return <ShirtIcon className="h-4 w-4" />;
    default:
      return <PackageIcon className="h-4 w-4" />;
  }
}

export function RequirementDetails({ program }: RequirementDetailsProps) {
  const requirements =
    program.requirements ?? program.standardProgramVersion?.requirements ?? [];

  if (requirements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {requirements.map((requirement: RequirementList, index: number) => (
        <div key={index} className="space-y-3">
          <div className="flex items-center gap-2">
            {getCategoryIcon(requirement.category)}
            <h3 className="text-lg font-semibold text-foreground">
              {requirement.name}
            </h3>
          </div>
          <div className="space-y-2">
            {requirement.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {item.quantity && item.quantity > 1 && `${item.quantity}x `}
                    {item.item.name}
                  </p>
                  {item.notes && (
                    <p className="text-xs text-foreground-500 mt-1">
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
