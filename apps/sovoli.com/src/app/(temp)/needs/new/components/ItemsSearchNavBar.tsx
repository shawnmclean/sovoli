"use client";

import { Button } from "@sovoli/ui/components/button";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Chip } from "@sovoli/ui/components/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@sovoli/ui/components/dropdown";
import { Input } from "@sovoli/ui/components/input";
import { Navbar, NavbarContent } from "@sovoli/ui/components/navbar";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { ChevronDownIcon, SearchIcon, SlidersHorizontal } from "lucide-react";

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
  selectedItems,
}: ItemsSearchNavBarProps<TCategory>) {
  const hasSelectedItems = selectedItems.length > 0;
  const hasCategories = categories.length > 0;
  const activeCategoryCount = categories.filter(
    (category) => category.isActive,
  ).length;
  const filtersLabel =
    !hasCategories || activeCategoryCount === categories.length
      ? "Filter categories"
      : `Filter categories (${activeCategoryCount})`;

  return (
    <Navbar
      maxWidth="full"
      className="border-b border-default-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <NavbarContent className="flex w-full flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
        <Input
          className="w-full md:max-w-2xl"
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
                variant="flat"
                color="default"
                endContent={<ChevronDownIcon className="h-4 w-4" />}
                startContent={<SlidersHorizontal className="h-4 w-4" />}
              >
                {filtersLabel}
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

      {hasSelectedItems ? (
        <NavbarContent className="flex w-full pb-4 pt-0">
          <ScrollShadow
            hideScrollBar
            className="flex w-full gap-1 py-0.5"
            orientation="horizontal"
          >
            {selectedItems.map((item) => {
              const suffix = item.quantity > 0 ? ` x${item.quantity}` : "";
              return (
                <Chip key={item.id}>
                  {item.name}
                  {suffix}
                </Chip>
              );
            })}
          </ScrollShadow>
        </NavbarContent>
      ) : null}
    </Navbar>
  );
}
