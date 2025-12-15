"use client";

import { useMemo } from "react";
import type { Program } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import Link from "next/link";
import { pluralize } from "~/utils/pluralize";
import { useProgramSupplies } from "./useProgramSupplies";

interface SuppliesSectionProps {
  program: Program;
  orgInstance: OrgInstance;
}

export function SuppliesSection({
  program,
  orgInstance,
}: SuppliesSectionProps) {
  const { requirements, allItems, totals, selectedSuppliers } =
    useProgramSupplies(program, orgInstance);

  // Get first 4 items for summary
  const summaryItems = useMemo(() => {
    return allItems.slice(0, 4);
  }, [allItems]);

  // Calculate unique supplier names
  const uniqueSuppliers = useMemo(() => {
    const suppliers = new Set<string>();
    requirements.forEach((requirement, reqIndex) => {
      requirement.items.forEach((_item, itemIndex) => {
        const itemKey = `${reqIndex}-${itemIndex}`;
        const selectedSupplier = selectedSuppliers[itemKey];
        if (selectedSupplier) {
          suppliers.add(selectedSupplier);
        }
      });
    });
    return Array.from(suppliers);
  }, [requirements, selectedSuppliers]);

  // Format supplier list for display
  const supplierList = useMemo(() => {
    if (uniqueSuppliers.length === 0) return "";
    if (uniqueSuppliers.length === 1) return uniqueSuppliers[0] ?? "";
    if (uniqueSuppliers.length === 2) {
      return `${uniqueSuppliers[0]} and ${uniqueSuppliers[1]}`;
    }
    const lastSupplier = uniqueSuppliers[uniqueSuppliers.length - 1];
    const otherSuppliers = uniqueSuppliers.slice(0, -1).join(", ");
    return `${otherSuppliers}, and ${lastSupplier}`;
  }, [uniqueSuppliers]);

  if (requirements.length === 0) {
    return null;
  }

  return (
    <Link
      href={`/programs/${program.slug}/supplies`}
      className="block my-6 border-b border-default-200 pb-6"
    >
      <section className="overflow-hidden">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-2">
            What to Bring
          </h2>
          <p className="text-sm text-muted-foreground">
            {uniqueSuppliers.length > 0 && totals.totalPrice > 0 ? (
              <>
                {allItems.length}{" "}
                {pluralize(allItems.length, "required item", "required items")}{" "}
                • GYD {totals.totalPrice.toLocaleString()} • {supplierList}
              </>
            ) : (
              <>
                {allItems.length}{" "}
                {pluralize(allItems.length, "required item", "required items")}:
              </>
            )}
          </p>
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

            <div className="mt-3 underline">
              {uniqueSuppliers.length > 0
                ? "View full list & prices"
                : "See complete list"}
            </div>
          </div>
        </div>
      </section>
    </Link>
  );
}
