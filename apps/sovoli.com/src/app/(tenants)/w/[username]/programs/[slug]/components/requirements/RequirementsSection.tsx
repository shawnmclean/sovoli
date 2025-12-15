"use client";

import { useMemo } from "react";
import type { Program, RequirementList } from "~/modules/academics/types";
import type { Item } from "~/modules/core/items/types";
import Link from "next/link";

interface RequirementsSectionProps {
  program: Program;
}

interface RequirementItem {
  item: Item;
  quantity?: number;
  unit?: string;
  notes?: string;
}

export function RequirementsSection({ program }: RequirementsSectionProps) {
  const requirements = useMemo(
    () =>
      program.requirements ??
      program.standardProgramVersion?.requirements ??
      [],
    [program.requirements, program.standardProgramVersion?.requirements],
  );

  // Flatten all items from all requirements
  const allItems = useMemo(() => {
    const items: RequirementItem[] = [];

    requirements.forEach((requirement: RequirementList) => {
      // Filter out items that don't have valid item data (runtime data may not match types)
      const validItems = requirement.items.filter(
        (entry) => (entry as { item?: { name?: string } }).item?.name,
      ) as RequirementItem[];
      items.push(...validItems);
    });

    return items;
  }, [requirements]);

  // Get first 4 items for summary
  const summaryItems = useMemo(() => {
    return allItems.slice(0, 4);
  }, [allItems]);

  // Calculate remaining items count
  const remainingCount = useMemo(() => {
    return Math.max(0, allItems.length - 4);
  }, [allItems.length]);

  if (requirements.length === 0) {
    return null;
  }

  return (
    <Link
      href={`/programs/${program.slug}/requirements`}
      className="block my-6 border-b border-default-200 pb-6"
    >
      <section className="overflow-hidden">
        <div className="pb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            Your Supply List
          </h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            {/* Summary items */}
            <div className="space-y-2">
              {summaryItems.map((item, index) => (
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

            {remainingCount > 0 && (
              <div className="mt-3 underline">show {remainingCount} more</div>
            )}
          </div>
        </div>
      </section>
    </Link>
  );
}
