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

          <Autocomplete
            className="max-w-xs"
            defaultItems={users}
            label="Assigned to"
            labelPlacement="inside"
            placeholder="Select a user"
            variant="bordered"
          >
            {(user) => (
              <AutocompleteItem key={user.id} textValue={user.name}>
                <div className="flex gap-2 items-center">
                  <Avatar
                    alt={user.name}
                    className="shrink-0"
                    size="sm"
                    src={user.avatar}
                  />
                  <div className="flex flex-col">
                    <span className="text-small">{user.name}</span>
                    <span className="text-tiny text-default-400">
                      {user.email}
                    </span>
                  </div>
                </div>
              </AutocompleteItem>
            )}
          </Autocomplete>
        </div>
      </div>
    </div>
  );
}
export const users = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    age: "29",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "Tech Lead",
    team: "Development",
    status: "paused",
    age: "25",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Jane Fisher",
    role: "Sr. Dev",
    team: "Development",
    status: "active",
    age: "22",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/2.png",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    name: "William Howard",
    role: "C.M.",
    team: "Marketing",
    status: "vacation",
    age: "28",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/2.png",
    email: "william.howard@example.com",
  },
  {
    id: 5,
    name: "Kristen Copper",
    role: "S. Manager",
    team: "Sales",
    status: "active",
    age: "24",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png",
    email: "kristen.cooper@example.com",
  },
  {
    id: 6,
    name: "Brian Kim",
    role: "P. Manager",
    team: "Management",
    age: "29",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/3.png",
    email: "brian.kim@example.com",
    status: "active",
  },
  {
    id: 7,
    name: "Michael Hunt",
    role: "Designer",
    team: "Design",
    status: "paused",
    age: "27",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/4.png",
    email: "michael.hunt@example.com",
  },
  {
    id: 8,
    name: "Samantha Brooks",
    role: "HR Manager",
    team: "HR",
    status: "active",
    age: "31",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/4.png",
    email: "samantha.brooks@example.com",
  },
  {
    id: 9,
    name: "Frank Harrison",
    role: "F. Manager",
    team: "Finance",
    status: "vacation",
    age: "33",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/5.png",
    email: "frank.harrison@example.com",
  },
  {
    id: 10,
    name: "Emma Adams",
    role: "Ops Manager",
    team: "Operations",
    status: "active",
    age: "35",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/5.png",
    email: "emma.adams@example.com",
  },
  {
    id: 11,
    name: "Brandon Stevens",
    role: "Jr. Dev",
    team: "Development",
    status: "active",
    age: "22",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/7.png",
    email: "brandon.stevens@example.com",
  },
  {
    id: 12,
    name: "Megan Richards",
    role: "P. Manager",
    team: "Product",
    status: "paused",
    age: "28",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/7.png",
    email: "megan.richards@example.com",
  },
  {
    id: 13,
    name: "Oliver Scott",
    role: "S. Manager",
    team: "Security",
    status: "active",
    age: "37",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/8.png",
    email: "oliver.scott@example.com",
  },
  {
    id: 14,
    name: "Grace Allen",
    role: "M. Specialist",
    team: "Marketing",
    status: "active",
    age: "30",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/8.png",
    email: "grace.allen@example.com",
  },
  {
    id: 15,
    name: "Noah Carter",
    role: "IT Specialist",
    team: "I. Technology",
    status: "paused",
    age: "31",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/9.png",
    email: "noah.carter@example.com",
  },
  {
    id: 16,
    name: "Ava Perez",
    role: "Manager",
    team: "Sales",
    status: "active",
    age: "29",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/9.png",
    email: "ava.perez@example.com",
  },
  {
    id: 17,
    name: "Liam Johnson",
    role: "Data Analyst",
    team: "Analysis",
    status: "active",
    age: "28",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/11.png",
    email: "liam.johnson@example.com",
  },
  {
    id: 18,
    name: "Sophia Taylor",
    role: "QA Analyst",
    team: "Testing",
    status: "active",
    age: "27",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/11.png",
    email: "sophia.taylor@example.com",
  },
  {
    id: 19,
    name: "Lucas Harris",
    role: "Administrator",
    team: "Information Technology",
    status: "paused",
    age: "32",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/12.png",
    email: "lucas.harris@example.com",
  },
  {
    id: 20,
    name: "Mia Robinson",
    role: "Coordinator",
    team: "Operations",
    status: "active",
    age: "26",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/12.png",
    email: "mia.robinson@example.com",
  },
];
