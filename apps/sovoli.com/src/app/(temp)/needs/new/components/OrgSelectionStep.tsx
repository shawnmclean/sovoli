"use client";

import { useState } from "react";
import { Divider } from "@sovoli/ui/components/divider";
import { Select, SelectItem } from "@sovoli/ui/components/select";
import { OrganizationAutocomplete } from "~/components/OrganizationAutocomplete";
import { ORGS } from "~/modules/data/organisations";
import { LocationInfo } from "./LocationInfo";
import {
  CONTACT_ROLE_OPTIONS,
  ORG_TYPE_OPTIONS,
  PARISH_OPTIONS,
} from "./options";
import { slugify } from "~/utils/slugify";
import type {
  ContactRoleOptionKey,
  OrgTypeOptionKey,
  ParishOptionKey,
} from "./options";

type OrgInstance = (typeof ORGS)[number];
type OrgLocation = OrgInstance["org"]["locations"][number];

const getPrimaryLocation = (
  locations: OrgInstance["org"]["locations"],
): OrgLocation | undefined => {
  return locations.find((location) => location.isPrimary) ?? locations[0];
};

const stateToParishKey = (state?: string): ParishOptionKey | "" => {
  if (!state) {
    return "";
  }

  const normalized = slugify(state);
  const isValidParish = PARISH_OPTIONS.some(
    (option) => option.key === normalized,
  );

  return isValidParish ? (normalized as ParishOptionKey) : "";
};

const inferOrgType = (org: OrgInstance): OrgTypeOptionKey | "" => {
  const categories = new Set(org.org.categories);

  if (categories.has("stationary")) {
    return "stationary";
  }

  if (categories.has("special-education-school")) {
    return "special-education";
  }

  if (categories.has("vocational-school")) {
    return "tertiary";
  }

  const ownership = categories.has("public-school")
    ? "public"
    : categories.has("private-school")
      ? "private"
      : null;

  if (!ownership) {
    return "";
  }

  if (categories.has("primary-school")) {
    return `${ownership}-primary` as OrgTypeOptionKey;
  }

  if (categories.has("nursery-school")) {
    return `${ownership}-basic` as OrgTypeOptionKey;
  }

  return "";
};

interface OrgSelectionStepProps {
  selectedOrgKey: string | null;
  schoolName: string;
  schoolUsername: string;
  schoolType: OrgTypeOptionKey | "";
  contactRole: ContactRoleOptionKey | "";
  locationAddressLine1: string;
  locationAddressLine2: string;
  locationCity: string;
  locationParish: ParishOptionKey | "";
  onSelectedOrgKeyChange: (key: string | null) => void;
  onSchoolNameChange: (value: string) => void;
  onSchoolUsernameChange: (value: string) => void;
  onSchoolTypeChange: (value: OrgTypeOptionKey | "") => void;
  onContactRoleChange: (value: ContactRoleOptionKey | "") => void;
  onAddressLine1Change: (value: string) => void;
  onAddressLine2Change: (value: string) => void;
  onCityChange: (value: string) => void;
  onParishChange: (value: ParishOptionKey | "") => void;
}

export function OrgSelectionStep({
  selectedOrgKey,
  schoolName,
  schoolType,
  contactRole,
  locationAddressLine1,
  locationAddressLine2,
  locationCity,
  locationParish,
  onSelectedOrgKeyChange,
  onSchoolNameChange,
  onSchoolUsernameChange,
  onSchoolTypeChange,
  onContactRoleChange,
  onAddressLine1Change,
  onAddressLine2Change,
  onCityChange,
  onParishChange,
}: OrgSelectionStepProps) {
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Check if selectedOrgKey corresponds to an existing organization
  const selectedOrg = selectedOrgKey
    ? ORGS.find((org) => org.org.username === selectedOrgKey)
    : null;

  const applyLocation = (location?: OrgLocation) => {
    const nextAddressLine1 = location?.address.line1 ?? "";
    if (locationAddressLine1 !== nextAddressLine1) {
      onAddressLine1Change(nextAddressLine1);
    }

    const nextAddressLine2 =
      location?.address.line2 ?? location?.address.line3 ?? "";
    if (locationAddressLine2 !== nextAddressLine2) {
      onAddressLine2Change(nextAddressLine2);
    }

    const nextCity = location?.address.city ?? "";
    if (locationCity !== nextCity) {
      onCityChange(nextCity);
    }

    const nextParish = stateToParishKey(location?.address.state);
    if (locationParish !== nextParish) {
      onParishChange(nextParish);
    }
  };

  const clearLocation = () => {
    applyLocation(undefined);
  };

  const trimmedSchoolName = schoolName.trim();
  const hasEnteredSchoolName = trimmedSchoolName.length > 0;
  const hasSelectedOrg = Boolean(selectedOrg);
  const hasOrgContext = isCreatingNew || hasSelectedOrg;
  const showOrganisationType =
    hasOrgContext || (hasEnteredSchoolName && !hasSelectedOrg);
  const showLocationInfo =
    hasOrgContext || (hasEnteredSchoolName && !hasSelectedOrg);
  const showRoleSelect = hasOrgContext;

  const handleOrgSelectionChange = (key: string | null) => {
    onSelectedOrgKeyChange(key);
    if (key) {
      const org = ORGS.find((o) => o.org.username === key);
      if (org) {
        // Existing org selected
        setIsCreatingNew(false);
        onSchoolNameChange(org.org.name);
        onSchoolUsernameChange(org.org.username);
        const inferredType = inferOrgType(org);
        if (schoolType !== inferredType) {
          onSchoolTypeChange(inferredType);
        }
        const location = getPrimaryLocation(org.org.locations);
        applyLocation(location);
      } else {
        // Custom value entered (not matching any org)
        setIsCreatingNew(true);
        onSchoolNameChange(key);
        onSchoolUsernameChange(slugify(key));
        if (schoolType !== "") {
          onSchoolTypeChange("");
        }
        clearLocation();
      }
    } else {
      // Clear selection and reset creation state
      const wasCreatingNew = isCreatingNew;
      setIsCreatingNew(false);
      if (!wasCreatingNew) {
        onSchoolNameChange("");
      }
      onSchoolUsernameChange("");
      if (schoolType !== "") {
        onSchoolTypeChange("");
      }
      clearLocation();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">School / Organisation</h1>
      <div className="space-y-2">
        <OrganizationAutocomplete
          label="School or organisation"
          selectedKey={selectedOrgKey}
          onSelectionChange={handleOrgSelectionChange}
          placeholder="Type to search or create"
          categoryGroup="school"
          countryCode="JM"
          allowsCreate={true}
          onCreate={(name) => {
            console.log("Creating new organization:", name);
            setIsCreatingNew(true);
            onSchoolNameChange(name);
            onSchoolUsernameChange(slugify(name));
            if (schoolType !== "") {
              onSchoolTypeChange("");
            }
            clearLocation();
          }}
        />
      </div>

      {showOrganisationType && (
        <div className="space-y-2">
          <Select
            label="Organisation type"
            selectedKeys={schoolType ? [schoolType] : []}
            onSelectionChange={(keys) =>
              onSchoolTypeChange(
                (Array.from(keys)[0] as OrgTypeOptionKey | undefined) ?? "",
              )
            }
            placeholder="Select organisation type"
            size="lg"
          >
            {ORG_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
        </div>
      )}

      {showLocationInfo && (
        <LocationInfo
          addressLine1={locationAddressLine1}
          addressLine2={locationAddressLine2}
          city={locationCity}
          parish={locationParish}
          onAddressLine1Change={onAddressLine1Change}
          onAddressLine2Change={onAddressLine2Change}
          onCityChange={onCityChange}
          onParishChange={onParishChange}
        />
      )}

      {showRoleSelect && (
        <>
          <Divider className="my-3" />
          <div className="space-y-2">
            <Select
              label="Your role"
              selectedKeys={contactRole ? [contactRole] : []}
              onSelectionChange={(keys) =>
                onContactRoleChange(
                  (Array.from(keys)[0] as ContactRoleOptionKey | undefined) ??
                    "",
                )
              }
              placeholder="Select your role"
              size="lg"
            >
              {CONTACT_ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.key}>{option.label}</SelectItem>
              ))}
            </Select>
          </div>
        </>
      )}
    </div>
  );
}
