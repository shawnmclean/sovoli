"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@sovoli/ui/components/button";
import {
  Autocomplete,
  AutocompleteItem,
} from "@sovoli/ui/components/autocomplete";
import { Avatar } from "@sovoli/ui/components/avatar";
import { SearchIcon } from "lucide-react";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { PRIVATE_SCHOOLS } from "~/modules/data/organisations/private-schools";

export function Diagnostics() {
  const [value, setValue] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get all private schools for the dropdown
  const privateSchools = useMemo(
    () =>
      PRIVATE_SCHOOLS.filter((org) =>
        org.org.categories.includes("private-school"),
      ),
    [],
  );

  const onSelectionChange = (key: React.Key | null) => {
    setSelectedKey(key as string | null);
  };

  const onInputChange = (inputValue: string) => {
    setValue(inputValue);
  };

  const handleSearch = () => {
    const schoolName = selectedKey ?? value;
    if (!schoolName) return;

    setIsLoading(true);

    try {
      // Here you would implement the actual diagnostics logic
      console.log("Running diagnostics for school:", schoolName);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        // You could show results in a modal or navigate to a results page
        alert(`Diagnostics completed for: ${schoolName}`);
      }, 2000);
    } catch (error) {
      console.error("Error running diagnostics:", error);
      setIsLoading(false);
    }
  };

  const canSearch = (selectedKey ?? value) && !isLoading;

  // Get the current school name for WhatsApp message
  const getCurrentSchoolName = () => {
    if (selectedKey) {
      const selectedSchool = privateSchools.find(
        (school) => school.org.username === selectedKey,
      );
      return selectedSchool?.org.name ?? value;
    }
    return value;
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
              <label className="block text-sm font-medium text-default-700 mb-2">
                Select your school or enter a new one
              </label>
              <Autocomplete
                placeholder="Search school or enter a new school"
                selectedKey={selectedKey}
                onSelectionChange={onSelectionChange}
                onInputChange={onInputChange}
                className="w-full"
                size="md"
                defaultItems={privateSchools}
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
              >
                {(school) => (
                  <AutocompleteItem
                    key={school.org.username}
                    textValue={school.org.name}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={school.org.logo}
                        alt={`${school.org.name} logo`}
                        size="sm"
                        className="flex-shrink-0"
                      />
                      <span>{school.org.name}</span>
                    </div>
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>

            {/* Search Button */}
            <Button
              onPress={handleSearch}
              disabled={!canSearch}
              startContent={<SearchIcon size={16} />}
              className="w-full"
              size="lg"
            >
              {isLoading ? "Running Diagnostics..." : "Run School Diagnostics"}
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
