"use client";

import { useMemo } from "react";
import Image from "next/image";
import {
  Autocomplete,
  AutocompleteItem,
} from "@sovoli/ui/components/autocomplete";
import { ORGS } from "~/modules/data/organisations";
import { resolveOrgCategoryFilter } from "~/modules/organisations/lib/categoryHierarchy";
import { doesLocationValueMatchSegment } from "~/modules/organisations/lib/locationSegments";
import type { OrgInstance } from "~/modules/organisations/types";
import type { OrgCategoryKeys } from "~/modules/organisations/types";

export interface OrganizationAutocompleteProps {
  /** Selected organization username */
  selectedKey?: string | null;
  /** Callback when selection changes */
  onSelectionChange?: (key: string | null) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Filter by specific categories */
  categories?: OrgCategoryKeys[];
  /** Filter by category group (e.g., "school") */
  categoryGroup?: string;
  /** Filter by country code (e.g., "GY", "JM") */
  countryCode?: string;
  /** Filter by state or city */
  stateOrCity?: string;
  /** Custom className */
  className?: string;
  /** Whether to allow custom values */
  allowsCustomValue?: boolean;
  /** Footer component to display at the bottom of the autocomplete dropdown */
  footer?: React.ReactNode;
}

export function OrganizationAutocomplete({
  selectedKey,
  onSelectionChange,
  placeholder = "Select an organization",
  categories,
  categoryGroup,
  countryCode,
  stateOrCity,
  className,
  allowsCustomValue = false,
  footer,
}: OrganizationAutocompleteProps) {
  // Filter organizations based on provided criteria
  const filteredOrgs = useMemo(() => {
    let orgs: OrgInstance[] = ORGS;

    // Filter by category or category group
    if (categoryGroup) {
      const resolvedCategoryKeys = resolveOrgCategoryFilter(categoryGroup);
      if (resolvedCategoryKeys.length > 0) {
        orgs = orgs.filter((org) =>
          org.org.categories.some((cat) => resolvedCategoryKeys.includes(cat)),
        );
      }
    } else if (categories && categories.length > 0) {
      orgs = orgs.filter((org) =>
        org.org.categories.some((cat) => categories.includes(cat)),
      );
    }

    // Filter by country
    if (countryCode) {
      orgs = orgs.filter((org) =>
        org.org.locations.some(
          (location) =>
            location.address.countryCode &&
            location.address.countryCode.toLowerCase() ===
              countryCode.toLowerCase(),
        ),
      );
    }

    // Filter by state or city
    if (stateOrCity) {
      const targetSegment = stateOrCity;
      orgs = orgs.filter((org) =>
        org.org.locations.some((location) => {
          return (
            doesLocationValueMatchSegment(
              location.address.state,
              targetSegment,
            ) ||
            doesLocationValueMatchSegment(location.address.city, targetSegment)
          );
        }),
      );
    }

    return orgs;
  }, [categories, categoryGroup, countryCode, stateOrCity]);

  return (
    <Autocomplete
      defaultItems={filteredOrgs}
      placeholder={placeholder}
      selectedKey={selectedKey ?? null}
      onSelectionChange={(key) => {
        onSelectionChange?.(key ? (key as string) : null);
      }}
      className={className}
      allowsCustomValue={allowsCustomValue}
      footer={footer}
    >
      {(org) => (
        <AutocompleteItem key={org.org.username} textValue={org.org.name}>
          <div className="flex items-center gap-3">
            {org.org.logo && (
              <Image
                src={org.org.logo}
                alt={`${org.org.name} logo`}
                width={24}
                height={24}
                className="rounded-sm object-cover"
              />
            )}
            <span>{org.org.name}</span>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
