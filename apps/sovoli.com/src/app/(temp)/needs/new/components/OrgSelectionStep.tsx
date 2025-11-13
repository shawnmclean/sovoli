"use client";

import { useState } from "react";
import { Select, SelectItem } from "@sovoli/ui/components/select";
import { OrganizationAutocomplete } from "~/components/OrganizationAutocomplete";
import { ORGS } from "~/modules/data/organisations";
import { LocationInfo } from "./LocationInfo";
import { CONTACT_ROLE_OPTIONS, ORG_TYPE_OPTIONS } from "./options";
import type {
  ContactRoleOptionKey,
  OrgTypeOptionKey,
  ParishOptionKey,
} from "./options";

interface OrgSelectionStepProps {
  selectedOrgKey: string | null;
  schoolName: string;
  schoolType: OrgTypeOptionKey | "";
  contactRole: ContactRoleOptionKey | "";
  locationAddressLine1: string;
  locationAddressLine2: string;
  locationCity: string;
  locationParish: ParishOptionKey | "";
  onSelectedOrgKeyChange: (key: string | null) => void;
  onSchoolNameChange: (value: string) => void;
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

  // Show location and type only when creating new org
  // Show if: explicitly creating new, or have a school name but no selected org
  const showLocationAndType =
    isCreatingNew || (schoolName.trim().length > 0 && !selectedOrg);

  const handleOrgSelectionChange = (key: string | null) => {
    onSelectedOrgKeyChange(key);
    if (key) {
      const org = ORGS.find((o) => o.org.username === key);
      if (org) {
        // Existing org selected
        setIsCreatingNew(false);
        onSchoolNameChange(org.org.name);
      } else {
        // Custom value entered (not matching any org)
        setIsCreatingNew(true);
        onSchoolNameChange(key);
      }
    } else {
      // Clear selection - but keep isCreatingNew state if it was set
      if (!isCreatingNew) {
        onSchoolNameChange("");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <OrganizationAutocomplete
          label="School or organisation"
          selectedKey={selectedOrgKey}
          onSelectionChange={handleOrgSelectionChange}
          placeholder="Select an organization"
          categoryGroup="school"
          countryCode="JM"
          allowsCreate={true}
          onCreate={(name) => {
            console.log("Creating new organization:", name);
            setIsCreatingNew(true);
            onSchoolNameChange(name);
          }}
        />
        {showLocationAndType && schoolName.trim().length > 0 && (
          <p className="text-sm text-default-500">
            Give us some additional info for "{schoolName}"
          </p>
        )}
      </div>

      {showLocationAndType && (
        <>
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
        </>
      )}

      <div className="space-y-2">
        <Select
          label="Your role"
          selectedKeys={contactRole ? [contactRole] : []}
          onSelectionChange={(keys) =>
            onContactRoleChange(
              (Array.from(keys)[0] as ContactRoleOptionKey | undefined) ?? "",
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
    </div>
  );
}
