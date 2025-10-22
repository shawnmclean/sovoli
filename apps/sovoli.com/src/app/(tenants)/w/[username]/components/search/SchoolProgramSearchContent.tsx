"use client";

import { useState, useEffect } from "react";
import { Button } from "@sovoli/ui/components/button";
import {
  Autocomplete,
  AutocompleteItem,
} from "@sovoli/ui/components/autocomplete";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { PRIVATE_SCHOOLS } from "~/modules/data/organisations/private-schools";
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
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [availablePrograms, setAvailablePrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get all private schools for the dropdown
  const privateSchools = PRIVATE_SCHOOLS.filter((org) =>
    org.org.categories.includes("private-school"),
  );

  // Update available programs when school changes
  useEffect(() => {
    if (selectedSchool) {
      const school = privateSchools.find(
        (s) => s.org.username === selectedSchool,
      );
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
  }, [selectedSchool, privateSchools]);

  const handleSearch = async () => {
    if (!selectedSchool || !selectedProgram) return;

    onSearchStart?.();
    setIsLoading(true);

    try {
      // TODO: Implement school program search logic
      // This would search for products based on the selected school and program

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, just complete with mock results
      onSearchComplete?.(0);
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
        <h2 className="text-default-600 font-medium mb-2">
          Search by school program
        </h2>

        <div className="space-y-4">
          {/* School Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              School Name
            </label>
            <Autocomplete
              placeholder="Search for a school"
              selectedKey={selectedSchool}
              onSelectionChange={(key) => {
                setSelectedSchool((key as string) || "");
              }}
              className="w-full"
              allowsCustomValue={false}
            >
              {privateSchools.map((school) => (
                <AutocompleteItem
                  key={school.org.username}
                  textValue={school.org.name}
                >
                  <div className="flex items-center gap-3">
                    {school.org.logo && (
                      <Image
                        src={school.org.logo}
                        alt={`${school.org.name} logo`}
                        width={24}
                        height={24}
                        className="rounded-sm object-cover"
                      />
                    )}
                    <span>{school.org.name}</span>
                  </div>
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>

          {/* Program Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Program Name
            </label>
            <Autocomplete
              placeholder={
                selectedSchool
                  ? "Search for a program"
                  : "Select a school first"
              }
              selectedKey={selectedProgram || null}
              onSelectionChange={(key) => {
                console.log("Program selected:", key);
                setSelectedProgram((key as string) || "");
              }}
              isDisabled={!selectedSchool || availablePrograms.length === 0}
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

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={!canSearch}
            startContent={<SearchIcon size={16} />}
            className="w-full"
          >
            {isLoading ? "Searching..." : "Search Products"}
          </Button>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="mt-4 p-3 bg-primary-50 text-primary-900 rounded-lg text-sm">
            Searching for products for this program...
          </div>
        )}

        {/* TODO: Add results display when search is implemented */}
      </div>
    </div>
  );
}
