"use client";

import { useState } from "react";
import { Input } from "@sovoli/ui/components/input";
import { Button } from "@sovoli/ui/components/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@sovoli/ui/components/dropdown";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Alert } from "@sovoli/ui/components/alert";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import type { SharedSelection } from "@sovoli/ui/providers";

interface SearchProps {
  uniqueLocations: string[];
  uniquePrograms: string[];
}

export function Search({ uniqueLocations, uniquePrograms }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setTimeout(() => setShowAlert(true), 1000);
  };

  const handleLocationChange = (keys: SharedSelection) => {
    setSelectedLocation(keys.currentKey ?? "");
    setTimeout(() => setShowAlert(true), 1000);
  };

  const handleProgramsChange = (keys: SharedSelection) => {
    setSelectedPrograms(keys.currentKey ? [keys.currentKey] : []);
    setTimeout(() => setShowAlert(true), 1000);
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="relative">
        <Input
          placeholder="Search..."
          value={searchTerm}
          onValueChange={handleSearchChange}
          onFocus={() => setIsExpanded(true)}
          startContent={<SearchIcon />}
          className="w-full"
        />
      </div>

      <div
        className={`flex flex-col md:flex-row gap-4 transition-all duration-300 ease-in-out ${
          isExpanded
            ? "max-h-[200px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="bordered"
              className="w-full md:w-auto"
              endContent={<ChevronDownIcon />}
            >
              {selectedLocation || "Select Location"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Select Location"
            selectionMode="single"
            selectedKeys={[selectedLocation]}
            onSelectionChange={handleLocationChange}
          >
            <>
              <DropdownItem key="All">All Locations</DropdownItem>
              {uniqueLocations.map((location) => (
                <DropdownItem key={location} className="capitalize">
                  {location}
                </DropdownItem>
              ))}
            </>
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="bordered"
              className="w-full md:w-auto"
              endContent={<ChevronDownIcon />}
            >
              {selectedPrograms.length
                ? `${selectedPrograms.length} Programs`
                : "Select Programs"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Select Programs"
            closeOnSelect={false}
            selectionMode="multiple"
            selectedKeys={selectedPrograms}
            onSelectionChange={handleProgramsChange}
          >
            {uniquePrograms.map((program) => (
              <DropdownItem key={program}>
                <Checkbox value={program}>{program}</Checkbox>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      {showAlert && (
        <Alert
          variant="bordered"
          color="warning"
          className="mt-4"
          isClosable
          description="Filters Coming Soon!"
          onClose={() => {
            setIsExpanded(false);
            setSearchTerm("");
            setSelectedLocation("");
            setSelectedPrograms([]);
          }}
        />
      )}
    </div>
  );
}
