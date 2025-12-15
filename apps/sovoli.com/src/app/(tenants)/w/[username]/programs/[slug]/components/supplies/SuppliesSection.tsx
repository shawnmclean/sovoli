"use client";

import { useMemo } from "react";
import type { Program } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import Link from "next/link";
import { useProgramSupplies } from "./useProgramSupplies";

interface SuppliesSectionProps {
  program: Program;
  orgInstance?: OrgInstance;
}

export function SuppliesSection({
  program,
  orgInstance,
}: SuppliesSectionProps) {
  const { requirements, allItems, totals } = useProgramSupplies(
    program,
    orgInstance,
  );

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
      href={`/programs/${program.slug}/supplies`}
      className="block my-6 border-b border-default-200 pb-6"
    >
      <section className="overflow-hidden">
        <div className="pb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            What to Bring
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

            {orgInstance && totals.totalPrice > 0 && (
              <div className="mt-4 pt-4 border-t border-default-200">
                <div className="text-sm font-semibold text-foreground">
                  Total: GYD {totals.totalPrice.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Link>
  );
}
