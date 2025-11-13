"use client";

import { useState, useMemo, useEffect } from "react";
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
  /** Label for the autocomplete */
  label?: string;
  /** Selected organization username */
  selectedKey?: string | null;
  /** Callback when selection changes */
  onSelectionChange?: (key: string | null) => void;
  /** Callback when a new organization is created (called with the organization name) */
  onCreate?: (name: string) => void;
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
  /** Whether to allow creating new organizations (shows "Create new" option) */
  allowsCreate?: boolean;
  /** Footer component to display at the bottom of the autocomplete dropdown */
  footer?: React.ReactNode;
}

interface OrgInstanceWithCreate extends OrgInstance {
  isNew?: boolean;
}

export function OrganizationAutocomplete({
  label,
  selectedKey,
  onSelectionChange,
  onCreate,
  placeholder = "Select an organization",
  categories,
  categoryGroup,
  countryCode,
  stateOrCity,
  className,
  allowsCustomValue = false,
  allowsCreate = false,
  footer,
}: OrganizationAutocompleteProps) {
  const [inputValue, setInputValue] = useState("");

  // Filter organizations based on provided criteria
  const baseFilteredOrgs = useMemo(() => {
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

  // Sync inputValue with selectedKey when it changes from parent
  useEffect(() => {
    if (allowsCreate && selectedKey) {
      // Find the selected org in baseFilteredOrgs to get its name
      const selectedOrg = baseFilteredOrgs.find(
        (org) => org.org.username === selectedKey,
      );
      if (selectedOrg) {
        setInputValue(selectedOrg.org.name);
      }
    } else if (!selectedKey && allowsCreate) {
      // Clear input when selection is cleared (only when allowsCreate is true)
      setInputValue("");
    }
  }, [selectedKey, allowsCreate, baseFilteredOrgs]);

  // Filter items based on input and add "create new" option if no match (when allowsCreate is true)
  const filteredOrgs = useMemo(() => {
    if (!allowsCreate || !inputValue) {
      return baseFilteredOrgs;
    }

    // Filter by name based on input
    const filtered = baseFilteredOrgs.filter((org) =>
      org.org.name.toLowerCase().includes(inputValue.toLowerCase()),
    );

    // If input doesn't match any existing organization, add a "create new" option
    const hasExactMatch = baseFilteredOrgs.some(
      (org) => org.org.name.toLowerCase() === inputValue.toLowerCase(),
    );

    if (inputValue && !hasExactMatch) {
      // Create a temporary OrgInstance-like structure for the "create new" option
      const createOption: OrgInstanceWithCreate = {
        org: {
          username: `create-${inputValue}`,
          name: inputValue,
          categories: [],
          locations: [],
        },
        websiteModule: null,
        academicModule: null,
        serviceModule: null,
        workforceModule: null,
        scoringModule: null,
        isNew: true,
      };
      return [...filtered, createOption];
    }

    return filtered;
  }, [baseFilteredOrgs, inputValue, allowsCreate]);

  return (
    <Autocomplete
      label={label}
      {...(allowsCreate
        ? {
            inputValue,
            onInputChange: setInputValue,
            items: filteredOrgs,
          }
        : {
            defaultItems: filteredOrgs,
          })}
      placeholder={placeholder}
      selectedKey={selectedKey ?? null}
      multiple={false}
      onSelectionChange={(key) => {
        const keyString = key ? String(key) : null;
        if (allowsCreate && keyString) {
          const selected = filteredOrgs.find(
            (org) => org.org.username === keyString,
          );
          if (selected && (selected as OrgInstanceWithCreate).isNew) {
            // Handle creating the new organization
            // Call onCreate callback to notify parent that a new org was created
            onCreate?.(selected.org.name);
            // The username will be the input value for new orgs
            // Call onSelectionChange with the input value so parent can handle creation
            onSelectionChange?.(inputValue);
            // Set input value to the created name
            setInputValue(selected.org.name);
          } else if (selected) {
            // Existing organization selected
            // Update input value to show the selected org's name
            setInputValue(selected.org.name);
            // Call onSelectionChange with the username
            onSelectionChange?.(keyString);
          } else {
            // Fallback: org not found in filtered list (shouldn't happen, but handle it)
            onSelectionChange?.(keyString);
          }
        } else {
          onSelectionChange?.(keyString);
        }
      }}
      className={className}
      allowsCustomValue={allowsCustomValue}
      footer={footer}
    >
      {(org) => {
        const orgWithCreate = org as OrgInstanceWithCreate;
        return (
          <AutocompleteItem key={org.org.username} textValue={org.org.name}>
            <div className="flex items-center gap-3">
              {!orgWithCreate.isNew && org.org.logo && (
                <Image
                  src={org.org.logo}
                  alt={`${org.org.name} logo`}
                  width={24}
                  height={24}
                  className="rounded-sm object-cover"
                />
              )}
              <span>
                {orgWithCreate.isNew
                  ? `Create "${org.org.name}"`
                  : org.org.name}
              </span>
            </div>
          </AutocompleteItem>
        );
      }}
    </Autocomplete>
  );
}
