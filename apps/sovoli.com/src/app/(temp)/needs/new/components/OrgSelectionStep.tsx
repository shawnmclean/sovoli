"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
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

  const handleCreateNewClick = () => {
    setIsCreatingNew(true);
    onSelectedOrgKeyChange(null);
    // Don't clear schoolName here - let user type it in the autocomplete
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-default-600">
          School or organisation
        </label>
        <OrganizationAutocomplete
          selectedKey={selectedOrgKey}
          onSelectionChange={handleOrgSelectionChange}
          placeholder="Select an organization"
          categoryGroup="school"
          countryCode="JM"
          footer={
            <Button
              variant="bordered"
              className="w-full"
              onPress={handleCreateNewClick}
            >
              + Create new organization
            </Button>
          }
        />
      </div>

      {showLocationAndType && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-default-600">
              Organisation type
            </label>
            <Select
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
        <label className="text-sm font-medium text-default-600">
          Your role
        </label>
        <Select
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
