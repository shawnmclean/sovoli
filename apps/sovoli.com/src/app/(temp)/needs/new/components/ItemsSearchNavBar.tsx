"use client";

import { useEffect, useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Badge } from "@sovoli/ui/components/badge";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@sovoli/ui/components/dropdown";
import { Input } from "@sovoli/ui/components/input";
import { Navbar, NavbarContent } from "@sovoli/ui/components/navbar";
import { Tooltip } from "@sovoli/ui/components/tooltip";
import { SearchIcon, SlidersHorizontal } from "lucide-react";

interface ItemsSearchCategoryOption<TCategory extends string = string> {
  key: TCategory;
  label: string;
  isActive: boolean;
}

interface SelectedItemSummary {
  id: string;
  name: string;
  quantity: number;
}

interface ItemsSearchNavBarProps<TCategory extends string = string> {
  categories: ItemsSearchCategoryOption<TCategory>[];
  onToggleCategory: (categoryKey: TCategory) => void;
  onSearchQueryChange: (value: string) => void;
  searchQuery: string;
  selectedItems: SelectedItemSummary[];
}

export function ItemsSearchNavBar<TCategory extends string = string>({
  categories,
  onSearchQueryChange,
  onToggleCategory,
  searchQuery,
  selectedItems: _selectedItems,
}: ItemsSearchNavBarProps<TCategory>) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(true);

  useEffect(() => {
    if (!isTooltipOpen) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setIsTooltipOpen(false);
    }, 4000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isTooltipOpen]);
  const hasCategories = categories.length > 0;
  const selectableCategories = categories.filter(
    (category) => category.key !== "all",
  );
  const activeCategoryCount = selectableCategories.filter(
    (category) => category.isActive,
  ).length;
  const totalSelectableCategories = selectableCategories.length;
  const filtersLabel =
    !hasCategories || activeCategoryCount === totalSelectableCategories
      ? "Filter categories"
      : `Filter categories (${activeCategoryCount})`;

  return (
    <Navbar
      maxWidth="full"
      className="border-b border-default-200 bg-background/95 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <NavbarContent className="flex w-full items-center gap-3 py-3">
        <Input
          className="w-full flex-1"
          size="lg"
          placeholder="Search items..."
          value={searchQuery}
          onValueChange={onSearchQueryChange}
          startContent={<SearchIcon className="h-4 w-4 text-default-400" />}
        />

        {hasCategories ? (
          <Dropdown closeOnSelect={false}>
            <DropdownTrigger>
              <Button
                isIconOnly
                size="lg"
                variant="flat"
                color="default"
                className="shrink-0"
                aria-label={filtersLabel}
                title={filtersLabel}
              >
                <Tooltip
                  content="Disaster Relief Filters Applied"
                  placement="bottom-end"
                  isOpen={isTooltipOpen}
                  onOpenChange={setIsTooltipOpen}
                  showArrow
                  closeDelay={1000}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Tooltip>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Filter item categories"
              className="w-64"
              closeOnSelect={false}
            >
              {categories.map((category) => (
                <DropdownItem
                  key={category.key}
                  closeOnSelect={false}
                  className="px-2 py-1"
                  isReadOnly
                  textValue={category.label}
                >
                  <Checkbox
                    isSelected={category.isActive}
                    onClick={(event) => event.stopPropagation()}
                    onValueChange={() => onToggleCategory(category.key)}
                  >
                    {category.label}
                  </Checkbox>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        ) : null}
      </NavbarContent>
    </Navbar>
  );
}
