"use client";

import { Badge } from "@sovoli/ui/components/badge";
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
import { SearchIcon, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  formatPriority,
  formatStatus,
  formatTimeline,
  getPriorityChipColor,
  getStatusChipColor,
} from "~/app/(tenants)/w/[username]/(main-layout)/needs/components/needFormatters";
import { formatItemCategoryLabel } from "~/modules/core/items/utils";
import type { Need } from "~/modules/needs/types";
import { isMaterialNeed } from "~/modules/needs/types";
import { formatNeedTypeLabel } from "~/modules/needs/utils";

export interface NeedsExplorerEntry {
  id: string;
  need: Need;
  orgName: string;
  orgUsername: string;
  orgSiteName?: string;
  locationLabel?: string;
  locationAddressLine1?: string;
  locationCity?: string;
  locationCountryCode?: string;
  categoryKey: string;
  categoryLabel: string;
  categoryType: "item" | "need";
  isReliefNeed: boolean;
}

interface CategorySummary {
  key: string;
  label: string;
  type: "item" | "need";
  hasReliefNeed: boolean;
}

interface SearchableEntry extends NeedsExplorerEntry {
  searchText: string;
}

interface NeedsFilterBarProps {
  categories: { key: string; label: string; isActive: boolean }[];
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onToggleCategory: (key: string) => void;
  onResetFilters: () => void;
  hasCustomFilters: boolean;
}

function NeedsFilterBar({
  categories,
  onResetFilters,
  onSearchQueryChange,
  onToggleCategory,
  searchQuery,
  hasCustomFilters,
}: NeedsFilterBarProps) {
  const selectableCategories = categories.filter(
    (category) => category.key !== "all",
  );
  const activeCategoryCount = selectableCategories.filter(
    (category) => category.isActive,
  ).length;
  const totalSelectableCategories = selectableCategories.length;
  const filtersLabel =
    totalSelectableCategories === 0 ||
    activeCategoryCount === totalSelectableCategories
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
          placeholder="Search needs, items, or organisations..."
          value={searchQuery}
          onValueChange={onSearchQueryChange}
          startContent={<SearchIcon className="h-4 w-4 text-default-400" />}
        />

        {selectableCategories.length > 0 ? (
          <Dropdown closeOnSelect={false}>
            <DropdownTrigger asChild>
              <Button
                isIconOnly
                size="lg"
                radius="full"
                variant="bordered"
                color="primary"
                className="relative shrink-0 overflow-visible"
                aria-label={filtersLabel}
                title={filtersLabel}
              >
                <Badge
                  color="primary"
                  content={String(activeCategoryCount)}
                  size="md"
                  placement="bottom-right"
                  isInvisible={totalSelectableCategories === 0}
                  classNames={{
                    base: "relative inline-flex shrink-0",
                    badge:
                      "bottom-0 right-0 translate-x-[65%] translate-y-full w-5 h-5 min-w-5 min-h-5 text-small px-0 font-medium",
                  }}
                >
                  <SlidersHorizontal className="h-5 w-5 text-default-500" />
                </Badge>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Filter need categories"
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

        {hasCustomFilters ? (
          <Button
            size="lg"
            variant="light"
            color="default"
            onPress={onResetFilters}
          >
            Reset
          </Button>
        ) : null}
      </NavbarContent>
    </Navbar>
  );
}

function createSearchText(entry: NeedsExplorerEntry): string {
  const { need } = entry;
  const textFragments: string[] = [];
  const addFragment = (value?: string | null) => {
    if (typeof value === "string" && value.trim().length > 0) {
      textFragments.push(value);
    }
  };

  addFragment(need.slug);
  addFragment(need.title);
  addFragment(need.description);
  addFragment(need.notes);
  addFragment(need.projectId);
  addFragment(entry.orgName);
  addFragment(entry.orgSiteName);
  addFragment(entry.locationLabel);
  addFragment(entry.locationAddressLine1);
  addFragment(entry.locationCity);
  addFragment(entry.locationCountryCode);

  if (isMaterialNeed(need)) {
    addFragment(need.item.name);
    addFragment(need.item.brand);
    addFragment(need.item.unitLabel);
    addFragment(need.item.attributes?.source);
    if (Array.isArray(need.item.tags)) {
      need.item.tags.forEach(addFragment);
    }
  }

  switch (need.type) {
    case "human":
      addFragment(need.roleSummary);
      if (Array.isArray(need.skills)) {
        need.skills.forEach(addFragment);
      }
      addFragment(need.shiftPattern);
      break;
    case "service":
      addFragment(need.serviceCategory);
      if (Array.isArray(need.statementOfWork)) {
        need.statementOfWork.forEach(addFragment);
      }
      addFragment(need.rfpUrl);
      break;
    case "financial":
      addFragment(need.pledgeUrl);
      break;
    case "job":
      if (need.position) {
        addFragment(need.position.name);
        addFragment(need.position.description);
      }
      break;
    default:
      break;
  }

  return textFragments.join(" ").toLowerCase();
}

function getNeedTypeChipColor(
  type: Need["type"],
): "default" | "primary" | "secondary" | "warning" {
  switch (type) {
    case "material":
      return "primary";
    case "service":
      return "secondary";
    case "financial":
      return "warning";
    default:
      return "default";
  }
}

function formatQuantityLabel(need: Need): string {
  if (typeof need.quantity !== "number") {
    return "Not specified";
  }

  if (!isMaterialNeed(need)) {
    return String(need.quantity);
  }

  const unit = need.item.unitLabel;
  if (!unit) {
    return String(need.quantity);
  }

  const pluralisedUnit = need.quantity === 1 ? unit : `${unit}s`;
  return `${need.quantity} ${pluralisedUnit}`;
}

export function NeedsExplorer({ entries }: { entries: NeedsExplorerEntry[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const categorySummaries = useMemo(() => {
    const map = new Map<string, CategorySummary>();

    for (const entry of entries) {
      const existing = map.get(entry.categoryKey);
      if (existing) {
        if (entry.isReliefNeed) {
          existing.hasReliefNeed = true;
        }
        continue;
      }

      map.set(entry.categoryKey, {
        key: entry.categoryKey,
        label: entry.categoryLabel,
        type: entry.categoryType,
        hasReliefNeed: entry.isReliefNeed,
      });
    }

    return Array.from(map.values()).sort((a, b) => {
      if (a.type === b.type) {
        return a.label.localeCompare(b.label);
      }
      return a.type === "item" ? -1 : 1;
    });
  }, [entries]);

  const defaultActiveCategoryKeys = useMemo(() => {
    const reliefCategories = categorySummaries
      .filter((category) => category.hasReliefNeed)
      .map((category) => category.key);

    if (reliefCategories.length > 0) {
      return reliefCategories;
    }

    return categorySummaries.map((category) => category.key);
  }, [categorySummaries]);

  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    () => new Set(defaultActiveCategoryKeys),
  );
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (defaultActiveCategoryKeys.length > 0) {
      startTransition(() => {
        setActiveCategories(new Set(defaultActiveCategoryKeys));
      });
    }
  }, [defaultActiveCategoryKeys]);

  const searchableEntries = useMemo<SearchableEntry[]>(
    () =>
      entries.map((entry) => ({
        ...entry,
        searchText: createSearchText(entry),
      })),
    [entries],
  );

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const totalCategoryCount = categorySummaries.length;
  const allCategoriesActive =
    totalCategoryCount === 0 || activeCategories.size === totalCategoryCount;

  const filteredEntries = useMemo(() => {
    return searchableEntries.filter((entry) => {
      const matchesCategory =
        allCategoriesActive || activeCategories.has(entry.categoryKey);

      if (!matchesCategory) {
        return false;
      }

      if (trimmedQuery.length === 0) {
        return true;
      }

      return entry.searchText.includes(trimmedQuery);
    });
  }, [activeCategories, allCategoriesActive, searchableEntries, trimmedQuery]);

  const groupedEntries = useMemo(() => {
    const groups = new Map<
      string,
      { label: string; entries: SearchableEntry[] }
    >();

    for (const category of categorySummaries) {
      groups.set(category.key, { label: category.label, entries: [] });
    }

    for (const entry of filteredEntries) {
      const group = groups.get(entry.categoryKey);
      if (group) {
        group.entries.push(entry);
      }
    }

    return categorySummaries
      .map((category) => {
        const group = groups.get(category.key);
        return group ? { key: category.key, ...group } : null;
      })
      .filter(
        (
          group,
        ): group is {
          key: string;
          label: string;
          entries: SearchableEntry[];
        } => Boolean(group && group.entries.length > 0),
      );
  }, [categorySummaries, filteredEntries]);

  const defaultCategorySet = useMemo(
    () => new Set(defaultActiveCategoryKeys),
    [defaultActiveCategoryKeys],
  );

  const hasCustomCategorySelection = useMemo(() => {
    if (activeCategories.size !== defaultCategorySet.size) {
      return true;
    }

    for (const key of activeCategories) {
      if (!defaultCategorySet.has(key)) {
        return true;
      }
    }

    return false;
  }, [activeCategories, defaultCategorySet]);

  const hasCustomFilters =
    hasCustomCategorySelection || trimmedQuery.length > 0;

  const categoryOptions = useMemo(() => {
    const baseOptions = categorySummaries.map((category) => ({
      key: category.key,
      label: category.label,
      isActive: activeCategories.has(category.key),
    }));

    const allOption = {
      key: "all",
      label: "All categories",
      isActive: allCategoriesActive,
    };

    return [allOption, ...baseOptions];
  }, [activeCategories, allCategoriesActive, categorySummaries]);

  const visibleNeedCount = filteredEntries.length;
  const totalNeedCount = entries.length;
  const uniqueOrgCount = useMemo(() => {
    const usernames = new Set(entries.map((entry) => entry.orgUsername));
    return usernames.size;
  }, [entries]);

  const handleToggleCategory = (categoryKey: string) => {
    if (categoryKey === "all") {
      if (allCategoriesActive) {
        setActiveCategories(new Set());
      } else {
        setActiveCategories(
          new Set(categorySummaries.map((category) => category.key)),
        );
      }
      return;
    }

    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryKey)) {
        next.delete(categoryKey);
      } else {
        next.add(categoryKey);
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveCategories(new Set(defaultActiveCategoryKeys));
  };

  if (entries.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          No needs have been published yet
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Check back soon — organisations will share their relief needs here as
          they are verified.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <NeedsFilterBar
        categories={categoryOptions}
        hasCustomFilters={hasCustomFilters}
        onResetFilters={handleResetFilters}
        onSearchQueryChange={setSearchQuery}
        onToggleCategory={handleToggleCategory}
        searchQuery={searchQuery}
      />

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10">
        <header className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {visibleNeedCount}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {totalNeedCount}
            </span>{" "}
            needs across {uniqueOrgCount} organisations.
          </p>
          <p className="text-xs text-muted-foreground">
            Relief-focused categories are pre-selected. Use the filters to
            explore all categories or search for a specific need.
          </p>
        </header>

        {groupedEntries.length > 0 ? (
          groupedEntries.map((group) => (
            <div key={group.key} className="space-y-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  {group.label}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {group.entries.length} need
                  {group.entries.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="space-y-4">
                {group.entries.map((entry) => {
                  const { need } = entry;
                  const timeline = formatTimeline(need);
                  const formattedPriority = formatPriority(need.priority);
                  const formattedStatus = formatStatus(need.status);
                  const quantityLabel = formatQuantityLabel(need);
                  const title =
                    need.title.trim().length > 0 ? need.title : "Untitled need";
                  const locationSummary = entry.locationLabel
                    ? entry.locationAddressLine1
                      ? `${entry.locationLabel} • ${entry.locationAddressLine1}`
                      : entry.locationLabel
                    : null;

                  return (
                    <div
                      key={entry.id}
                      className="rounded-xl border border-default-200 bg-card px-4 py-5 shadow-sm transition-colors hover:border-primary-200 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-base font-semibold text-foreground">
                                {title}
                              </span>
                              {entry.isReliefNeed ? (
                                <Badge color="primary" variant="flat">
                                  Relief
                                </Badge>
                              ) : null}
                              <Chip
                                size="sm"
                                color={getNeedTypeChipColor(need.type)}
                                variant="flat"
                              >
                                {formatNeedTypeLabel(need.type)}
                              </Chip>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {entry.orgSiteName ?? entry.orgName}
                              {entry.orgSiteName &&
                              entry.orgSiteName !== entry.orgName ? (
                                <span className="text-muted-foreground">
                                  {" "}
                                  · {entry.orgName}
                                </span>
                              ) : null}
                              {locationSummary ? (
                                <span className="text-muted-foreground">
                                  {" "}
                                  · {locationSummary}
                                </span>
                              ) : null}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {formattedPriority ? (
                              <Chip
                                size="sm"
                                variant="flat"
                                color={getPriorityChipColor(need.priority)}
                              >
                                {formattedPriority}
                              </Chip>
                            ) : null}
                            {formattedStatus ? (
                              <Chip
                                size="sm"
                                variant="flat"
                                color={getStatusChipColor(need.status)}
                              >
                                {formattedStatus}
                              </Chip>
                            ) : null}
                          </div>
                        </div>

                        {need.description ? (
                          <p className="text-sm leading-relaxed text-foreground">
                            {need.description}
                          </p>
                        ) : null}

                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Quantity
                            </p>
                            <p className="text-sm text-foreground">
                              {quantityLabel}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Timeline
                            </p>
                            <p className="text-sm text-foreground">
                              {timeline ?? "Timeline not specified"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Project
                            </p>
                            <p className="text-sm text-foreground">
                              {need.projectId ?? "—"}
                            </p>
                          </div>
                        </div>

                        {isMaterialNeed(need) ? (
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>
                              <span className="font-medium text-foreground">
                                Item:{" "}
                              </span>
                              {need.item.name}
                              {need.item.brand ? ` • ${need.item.brand}` : ""}
                            </p>
                            <p>
                              <span className="font-medium text-foreground">
                                Category:{" "}
                              </span>
                              {formatItemCategoryLabel(need.item.category)}
                            </p>
                          </div>
                        ) : null}

                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="text-xs text-muted-foreground">
                            Last updated{" "}
                            {need.updatedAt ?? need.createdAt ?? "recently"}
                          </div>
                          <Button
                            as={Link}
                            href={`/w/${entry.orgUsername}/needs/${need.slug}`}
                            size="sm"
                            variant="flat"
                            color="primary"
                          >
                            View details
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-default-200 bg-default-50 px-5 py-12 text-center text-sm text-muted-foreground">
            No needs match your filters yet. Try a different search or enable
            more categories.
          </div>
        )}
      </section>
    </div>
  );
}
