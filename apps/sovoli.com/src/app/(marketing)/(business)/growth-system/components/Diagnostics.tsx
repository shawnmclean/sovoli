"use client";

import React, { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { SearchIcon } from "lucide-react";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { OrganizationAutocomplete } from "~/components/OrganizationAutocomplete";
import { ORGS } from "~/modules/data/organisations";
import { useRouter } from "next/navigation";

export function Diagnostics() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const router = useRouter();

  const onSelectionChange = (key: string | null) => {
    setSelectedKey(key);
  };

  const handleSearch = () => {
    if (!selectedKey) return;

    void router.push(`/${selectedKey}/dashboard`);
  };

  // Get the current school name for WhatsApp message
  const getCurrentSchoolName = () => {
    if (selectedKey) {
      const selectedSchool = ORGS.find(
        (org) => org.org.username === selectedKey,
      );
      return selectedSchool?.org.name ?? "";
    }
    return "";
  };

  const getWhatsAppMessage = () => {
    const schoolName = getCurrentSchoolName();
    return schoolName
      ? `I would like to run diagnostics on my school: ${schoolName}`
      : "I would like to run diagnostics on my school";
  };

  return (
    <section className="py-6 px-4 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">School Diagnostics</h2>
        </div>

        <div className="bg-background rounded-lg border border-default-200 p-6 sm:p-8">
          <div className="space-y-6">
            {/* School Selection */}
            <div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-default-600">
                  Find your school
                </label>
                <OrganizationAutocomplete
                  selectedKey={selectedKey}
                  onSelectionChange={onSelectionChange}
                  placeholder="School name..."
                  categoryGroup="school"
                  className="w-full"
                  footer={
                    <WhatsAppLink
                      message={getWhatsAppMessage()}
                      intent="Request Data"
                      page="landing"
                      funnel="discovery"
                      className="w-full"
                    >
                      <Button variant="bordered" className="w-full">
                        + Add My School
                      </Button>
                    </WhatsAppLink>
                  }
                />
              </div>
            </div>

            {/* Search Button */}
            <Button
              onPress={handleSearch}
              disabled={!selectedKey}
              startContent={<SearchIcon size={16} />}
              className="w-full"
              size="lg"
            >
              View Diagnostics
            </Button>

            {/* Info Text */}
            <div className="text-sm text-default-500 text-center">
              <p>
                Our diagnostics will analyze your school's website, social media
                presence, search engine visibility, and provide actionable
                recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
