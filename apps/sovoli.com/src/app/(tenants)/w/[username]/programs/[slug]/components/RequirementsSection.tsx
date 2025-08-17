"use client";

import { useMemo } from "react";
import { Chip } from "@sovoli/ui/components/chip";

import {
  PackageIcon,
  BookOpenIcon,
  DropletsIcon,
  ShirtIcon,
} from "lucide-react";
import type { Program, RequirementList } from "~/modules/academics/types";
import { ProgramSectionsWrapper } from "./ProgramSectionsWrapper";
import type { Item } from "~/modules/core/items/types";

interface RequirementsSectionProps {
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

function getCategoryLabel(category: string) {
  switch (category) {
    case "booklist":
      return "Books";
    case "materials":
      return "Supplies";
    case "hygiene":
      return "Hygiene";
    case "uniform":
      return "Uniform";
    case "fees":
      return "Fees";
    default:
      return "Other";
  }
}

interface RequirementItem {
  item: Item;
  quantity?: number;
  unit?: string;
  notes?: string;
}

interface CategoryData {
  items: RequirementItem[];
  count: number;
}

export function RequirementsSection({ program }: RequirementsSectionProps) {
  const requirements = useMemo(
    () =>
      program.requirements ??
      program.standardProgramVersion?.requirements ??
      [],
    [program.requirements, program.standardProgramVersion?.requirements],
  );

  // Group requirements by category and get summary
  const requirementsByCategory = useMemo(() => {
    const grouped = new Map<string, CategoryData>();

    requirements.forEach((requirement: RequirementList) => {
      const category = requirement.category;
      if (!grouped.has(category)) {
        grouped.set(category, { items: [], count: 0 });
      }
      const categoryData = grouped.get(category);
      if (categoryData) {
        categoryData.items.push(...requirement.items);
        categoryData.count += requirement.items.length;
      }
    });

    return grouped;
  }, [requirements]);

  // Get first few items from each category for summary
  const summaryItems = useMemo(() => {
    const items: {
      category: string;
      item: RequirementItem;
      categoryLabel: string;
    }[] = [];

    requirementsByCategory.forEach((data, category) => {
      const categoryLabel = getCategoryLabel(category);
      data.items.slice(0, 2).forEach((item) => {
        items.push({ category, item, categoryLabel });
      });
    });

    return items.slice(0, 4); // Show max 6 items in summary
  }, [requirementsByCategory]);

  if (requirements.length === 0) {
    return null;
  }

  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "";

  return (
    <ProgramSectionsWrapper
      program={program}
      sectionClickable={true}
      detailedView={
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
                        {item.quantity &&
                          item.quantity > 1 &&
                          `${item.quantity}x `}
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
      }
      detailedViewTitle={`${programName} List`}
    >
      <div className="overflow-hidden">
        <div className="pb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            What to Bring
          </h2>
        </div>

        <div className="space-y-6">
          {/* Summary by category */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {Array.from(requirementsByCategory.entries()).map(
                ([category, data]) => (
                  <Chip
                    key={category}
                    color="secondary"
                    variant="flat"
                    size="sm"
                  >
                    {getCategoryLabel(category)} ({data.count})
                  </Chip>
                ),
              )}
            </div>

            {/* Summary items */}
            <div className="space-y-2">
              {summaryItems.map(({ item }, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {item.quantity &&
                        item.quantity > 1 &&
                        `${item.quantity}x `}
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

            <div className="mt-3 underline">Show More</div>
          </div>
        </div>
      </div>
    </ProgramSectionsWrapper>
  );
}
