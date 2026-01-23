"use client";

import { Badge } from "@sovoli/ui/components/badge";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { Select, SelectItem } from "@sovoli/ui/components/select";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useMemo } from "react";
import type { OrgInstance } from "~/modules/organisations/types";

export type CategoryFilter =
  | "all"
  | "strong"
  | "uncertain"
  | "lowIntent"
  | "noVisibility";

export interface LeadsFilterProps {
  orgInstance: OrgInstance;
  query: string;
  selectedProgramId: string;
  selectedCategory: CategoryFilter;
  onQueryChange: (query: string) => void;
  onProgramChange: (programId: string) => void;
  onCategoryChange: (category: CategoryFilter) => void;
}

export function LeadsFilter({
  orgInstance,
  query,
  selectedProgramId,
  selectedCategory,
  onQueryChange,
  onProgramChange,
  onCategoryChange,
}: LeadsFilterProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleReset = () => {
    onProgramChange("all");
    onCategoryChange("all");
  };

  const handleApply = (onClose: () => void) => {
    onClose();
  };

  const programOptions = useMemo(() => {
    const programs = orgInstance.academicModule?.programs ?? [];
    return programs.map((p) => ({
      id: p.id,
      name: p.name ?? "Program",
    }));
  }, [orgInstance.academicModule?.programs]);

  const programOptionsWithAll = useMemo(
    () => [{ id: "all", name: "All programs" }, ...programOptions],
    [programOptions],
  );

  const statusOptions = useMemo(
    () =>
      [
        { id: "all", name: "All statuses" },
        { id: "noVisibility", name: "New / No activity" },
        { id: "uncertain", name: "Uncertain" },
        { id: "strong", name: "Strong" },
        { id: "lowIntent", name: "Low intent" },
      ] as const,
    [],
  );

  const hasActiveFilters =
    selectedProgramId !== "all" || selectedCategory !== "all";

  return (
    <>
      <div className="sticky top-14 z-[5] border-b border-default-200 bg-background">
        <div className="flex gap-3 px-4 py-4">
          <Input
            placeholder="Search leads..."
            value={query}
            onValueChange={onQueryChange}
            variant="bordered"
            className="flex-1"
            startContent={<Search size={16} />}
          />

          <Button
            isIconOnly
            variant="bordered"
            onPress={onOpen}
            aria-label="Open filters"
          >
            <Badge
              color="primary"
              content=""
              size="sm"
              placement="top-right"
              isInvisible={!hasActiveFilters}
            >
              <SlidersHorizontal size={20} />
            </Badge>
          </Button>
        </div>
      </div>

      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="bottom"
        size="md"
        hideCloseButton
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader />
              <DrawerBody className="space-y-4">
                <Button
                  fullWidth
                  variant="bordered"
                  onPress={handleReset}
                  aria-label="Reset filters"
                  isDisabled={!hasActiveFilters}
                  startContent={<RotateCcw size={20} />}
                >
                  Reset Filters
                </Button>

                <Select
                  label="Program"
                  items={programOptionsWithAll}
                  selectedKeys={new Set([selectedProgramId])}
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0];
                    onProgramChange(typeof key === "string" ? key : "all");
                  }}
                  variant="bordered"
                >
                  {(item) => (
                    <SelectItem key={item.id} textValue={item.name}>
                      {item.name}
                    </SelectItem>
                  )}
                </Select>

                <Select
                  label="Status"
                  items={statusOptions}
                  selectedKeys={new Set([selectedCategory])}
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0];
                    onCategoryChange(
                      (typeof key === "string" ? key : "all") as CategoryFilter,
                    );
                  }}
                  variant="bordered"
                >
                  {(item) => (
                    <SelectItem key={item.id} textValue={item.name}>
                      {item.name}
                    </SelectItem>
                  )}
                </Select>
              </DrawerBody>
              <DrawerFooter className="border-t border-default-200">
                <Button
                  color="primary"
                  fullWidth
                  onPress={() => handleApply(onClose)}
                  aria-label="Apply filters"
                >
                  Apply
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
