"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@sovoli/ui/components/button";
import {
  Autocomplete,
  AutocompleteItem,
} from "@sovoli/ui/components/autocomplete";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { PRIVATE_SCHOOLS } from "~/modules/data/organisations/private-schools";
import type { Program } from "~/modules/academics/types";
import { Avatar } from "@sovoli/ui/components/avatar";

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

  // Get all private schools for the dropdown
  const privateSchools = useMemo(
    () =>
      PRIVATE_SCHOOLS.filter((org) =>
        org.org.categories.includes("private-school"),
      ),
    [],
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
            <Autocomplete
              defaultItems={privateSchools}
              placeholder="Select your school"
              selectedKey={selectedSchool}
              onSelectionChange={(key) => {
                setSelectedSchool((key as string) || "");
              }}
              className="w-full"
            >
              {(school) => (
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
              )}
            </Autocomplete>
          </div>

          {/* Program Selection */}
          {selectedSchool && availablePrograms.length > 0 && (
            <div>
              <Autocomplete
                placeholder="Search for a program"
                selectedKey={selectedProgram || null}
                onSelectionChange={(key) => {
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
