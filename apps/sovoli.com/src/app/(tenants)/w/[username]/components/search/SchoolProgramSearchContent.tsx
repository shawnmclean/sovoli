"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@sovoli/ui/components/button";
import {
  Autocomplete,
  AutocompleteItem,
} from "@sovoli/ui/components/autocomplete";
import { SearchIcon } from "lucide-react";
import { OrganizationAutocomplete } from "~/components/OrganizationAutocomplete";
import { ORGS } from "~/modules/data/organisations";
import type { Program } from "~/modules/academics/types";

interface SchoolProgramSearchContentProps {
  onSearchStart?: () => void;
  onSearchComplete?: (resultsFound: number) => void;
  source?: "landing_page" | "mobile_drawer" | "search_page";
}

export function SchoolProgramSearchContent({
  onSearchStart,
  onSearchComplete,
  source: _source = "landing_page",
}: SchoolProgramSearchContentProps) {
  const router = useRouter();
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [availablePrograms, setAvailablePrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Update available programs when school changes
  useEffect(() => {
    if (selectedSchool) {
      const school = ORGS.find((s) => s.org.username === selectedSchool);
      const programs = school?.academicModule?.programs ?? [];
      console.log("Available programs:", programs);
      setAvailablePrograms(programs);
      // Only reset program if it's not valid for the new school
      setSelectedProgram((prevProgram) => {
        const isValidProgram = programs.some((p) => p.id === prevProgram);
        return isValidProgram ? prevProgram : "";
      });
    } else {
      setAvailablePrograms([]);
      setSelectedProgram("");
    }
  }, [selectedSchool]);

  const handleSearch = () => {
    if (!selectedSchool || !selectedProgram) return;

    onSearchStart?.();
    setIsLoading(true);

    try {
      // Navigate to catalog page with school and program query params
      const searchParams = new URLSearchParams({
        school: selectedSchool,
        program: selectedProgram,
      });

      router.push(`/catalog?${searchParams.toString()}`);

      onSearchComplete?.(1);
    } catch (error) {
      console.error("Error searching school programs:", error);
      onSearchComplete?.(0);
    } finally {
      setIsLoading(false);
    }
  };

  const canSearch = selectedSchool && selectedProgram && !isLoading;

  return (
    <div className="flex flex-col gap-4 my-2">
      <div>
        <div className="space-y-4">
          {/* School Selection */}
          <div>
            <OrganizationAutocomplete
              placeholder="Select your school"
              selectedKey={selectedSchool || null}
              onSelectionChange={(key) => {
                setSelectedSchool(key ?? "");
              }}
              categoryGroup="school"
              className="w-full"
              countryCode="GY"
            />
          </div>

          {/* Program Selection */}
          {selectedSchool && availablePrograms.length > 0 && (
            <div>
              <Autocomplete
                placeholder="Search for a program"
                selectedKey={selectedProgram || null}
                onSelectionChange={(key: React.Key | null) => {
                  console.log("Program selected:", key);
                  setSelectedProgram((key as string) || "");
                }}
                className="w-full"
                allowsCustomValue={false}
              >
                {availablePrograms.map((program) => (
                  <AutocompleteItem
                    key={program.id}
                    textValue={program.name ?? program.slug}
                  >
                    {program.name ?? program.slug}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
          )}

          {/* Search Button */}
          <Button
            onPress={handleSearch}
            disabled={!canSearch}
            startContent={<SearchIcon size={16} />}
            className="w-full"
          >
            {isLoading ? "Searching..." : "Find Supply List"}
          </Button>
        </div>
      </div>
    </div>
  );
}
