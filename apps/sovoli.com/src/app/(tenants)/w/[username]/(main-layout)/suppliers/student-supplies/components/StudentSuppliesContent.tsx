"use client";

import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Chip } from "@sovoli/ui/components/chip";
import {
  BookOpenIcon,
  DropletsIcon,
  GraduationCapIcon,
  PackageIcon,
  ShirtIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Program, RequirementList } from "~/modules/academics/types";
import type { Item } from "~/modules/core/items/types";
import type { OrgInstanceWithWebsite } from "~/modules/organisations/types";

interface StudentSuppliesContentProps {
  orgInstance: OrgInstanceWithWebsite;
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
    default:
      return "Other";
  }
}

function getProgramName(program: Program): string {
  return (
    program.name ?? program.standardProgramVersion?.program.name ?? program.slug
  );
}

interface ProgramWithRequirements {
  program: Program;
  requirements: RequirementList[];
}

interface ItemWithPrograms {
  item: Item;
  quantity?: number;
  unit?: string;
  notes?: string;
  programs: string[];
}

interface CategoryWithItems {
  category: string;
  categoryName: string;
  items: ItemWithPrograms[];
}

export function StudentSuppliesContent({
  orgInstance,
}: StudentSuppliesContentProps) {
  // State for tracking which items are checked for price gathering
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const handleItemCheck = (itemKey: string, checked: boolean) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(itemKey);
      } else {
        newSet.delete(itemKey);
      }
      return newSet;
    });
  };

  const categoriesWithItems = useMemo(() => {
    const programs = (orgInstance.academicModule?.programs ?? []).filter(
      (p) => p.isActive !== false,
    );

    // First, collect all programs with their requirements
    const programsWithRequirements = programs
      .map((program): ProgramWithRequirements => {
        const requirements =
          program.requirements ??
          program.standardProgramVersion?.requirements ??
          [];
        return { program, requirements };
      })
      .filter(({ requirements }) => requirements.length > 0);

    // Group by category
    const categoryMap = new Map<string, Map<string, ItemWithPrograms>>();

    programsWithRequirements.forEach(({ program, requirements }) => {
      const programName = getProgramName(program);

      requirements.forEach((requirement) => {
        const category = requirement.category;

        if (!categoryMap.has(category)) {
          categoryMap.set(category, new Map());
        }

        const categoryItems = categoryMap.get(category);
        if (!categoryItems) return;

        requirement.items.forEach((itemEntry) => {
          const itemKey = itemEntry.item.id;

          if (categoryItems.has(itemKey)) {
            // Add program to existing item
            const existingItem = categoryItems.get(itemKey);
            if (!existingItem) return;
            if (!existingItem.programs.includes(programName)) {
              existingItem.programs.push(programName);
            }
          } else {
            // Create new item entry
            categoryItems.set(itemKey, {
              item: itemEntry.item,
              quantity: itemEntry.quantity,
              unit: itemEntry.unit,
              notes: itemEntry.notes,
              programs: [programName],
            });
          }
        });
      });
    });

    // Convert to array and sort
    const categories: CategoryWithItems[] = Array.from(categoryMap.entries())
      .map(([category, itemsMap]) => ({
        category,
        categoryName: getCategoryLabel(category),
        items: Array.from(itemsMap.values()).sort((a, b) => {
          // Sort items by name
          return a.item.name.localeCompare(b.item.name);
        }),
      }))
      .sort((a, b) => {
        // Sort categories: booklist first, then materials, then others
        const categoryOrder = [
          "booklist",
          "materials",
          "hygiene",
          "uniform",
          "other",
        ];
        const aIndex = categoryOrder.indexOf(a.category);
        const bIndex = categoryOrder.indexOf(b.category);

        if (aIndex === -1 && bIndex === -1)
          return a.categoryName.localeCompare(b.categoryName);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });

    return categories;
  }, [orgInstance.academicModule?.programs]);

  if (categoriesWithItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <GraduationCapIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Student Supplies
            </h1>
            <p className="text-muted-foreground">
              No program requirements available at this time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Student Supplies
          </h1>
          <p className="text-muted-foreground">
            Complete list of supplies and requirements for all programs at{" "}
            {orgInstance.websiteModule.website.siteName}
          </p>
          {checkedItems.size > 0 && (
            <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-primary font-medium">
                ✓ {checkedItems.size} item{checkedItems.size !== 1 ? "s" : ""}{" "}
                selected for price gathering
              </p>
            </div>
          )}
        </div>

        {/* Categories List */}
        <div className="space-y-8">
          {categoriesWithItems.map(({ category, categoryName, items }) => (
            <div key={category} className="space-y-4">
              {/* Category Header */}
              <div className="border-b border-divider pb-2">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  {getCategoryIcon(category)}
                  {categoryName}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {items.length} unique item{items.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Items List */}
              <div className="space-y-4 pl-4">
                {items.map((itemWithPrograms, itemIndex) => {
                  const { item, unit, notes, programs } = itemWithPrograms;
                  const totalPrograms =
                    orgInstance.academicModule?.programs.filter(
                      (p) => p.isActive !== false,
                    ).length ?? 0;
                  const allPrograms =
                    programs.length === totalPrograms && totalPrograms > 0;

                  // Create a unique key for this item (using only item ID)
                  const itemKey = item.id;
                  const isChecked = checkedItems.has(itemKey);

                  return (
                    <div key={itemIndex} className="space-y-2">
                      {/* Item Header */}
                      <Checkbox
                        size="sm"
                        isSelected={isChecked}
                        onValueChange={(checked) =>
                          handleItemCheck(itemKey, checked)
                        }
                        className="p-2 rounded-lg hover:bg-default-100 transition-colors"
                        classNames={{
                          base: "flex items-start gap-2 w-full",
                          wrapper: "mt-1",
                          label: "flex-1",
                        }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`font-medium ${isChecked ? "line-through text-muted-foreground" : "text-foreground"}`}
                            >
                              {item.name}
                            </span>
                            {unit && (
                              <span className="text-sm text-muted-foreground">
                                ({unit})
                              </span>
                            )}
                            {/* Programs Chips */}
                            {allPrograms ? (
                              <Chip size="sm" color="primary" variant="flat">
                                All Programs
                              </Chip>
                            ) : (
                              <>
                                {programs
                                  .slice(0, 2)
                                  .map((programName, programIndex) => (
                                    <Chip
                                      key={programIndex}
                                      size="sm"
                                      variant="flat"
                                      color="default"
                                    >
                                      {programName}
                                    </Chip>
                                  ))}
                                {programs.length > 2 && (
                                  <Chip
                                    size="sm"
                                    variant="flat"
                                    color="default"
                                    className="opacity-70"
                                  >
                                    +{programs.length - 2}
                                  </Chip>
                                )}
                              </>
                            )}
                          </div>

                          {/* Notes */}
                          {notes && (
                            <div className="text-xs text-muted-foreground mt-1 ml-4">
                              {notes}
                            </div>
                          )}
                        </div>
                      </Checkbox>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-divider">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              This list is provided for suppliers and vendors to understand what
              students need for each program.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
