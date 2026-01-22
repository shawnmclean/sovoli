"use client";

import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";
import { SendIcon } from "lucide-react";
import { useState } from "react";

interface LocationInputProps {
  onSubmit: (value: string) => void;
}

export function LocationInput({ onSubmit }: LocationInputProps) {
  const [customLocation, setCustomLocation] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Guyana cities and towns near Mon Repos
  const locationOptions = [
    "Mon Repos",
    "Lusignan",
    "Annandale",
    "Buxton",
    "Enmore",
    "Vigilance",
    "Plaisance",
    "Beterverwagting",
    "Enterprise",
    "Strathspey",
    "Mahaica",
    "Golden Grove",
    "Good Hope",
    "Cove and John",
    "Foulis",
    "Non Pariel",
    "Haslington",
    "Victoria",
    "Belfield",
    "Cummings Lodge",
    "Georgetown",
    "New Amsterdam",
    "Linden",
    "Rose Hall",
    "Skeldon",
    "Corriverton",
    "Lethem",
    "Anna Regina",
    "Parika",
    "Bartica",
  ];

  const handleLocationSelect = (location: string) => {
    if (location === "Other") {
      setShowCustomInput(true);
    } else {
      onSubmit(location);
    }
  };

  const handleCustomSubmit = () => {
    if (customLocation.trim()) {
      onSubmit(customLocation.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && customLocation.trim()) {
      e.preventDefault();
      handleCustomSubmit();
    }
  };

  if (showCustomInput) {
    return (
      <div className="space-y-4 mt-2">
        <div className="text-center">
          <p className="text-sm text-default-600 mb-4">
            Please enter your location:
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            value={customLocation}
            onChange={(e) => setCustomLocation(e.target.value)}
            placeholder="Enter your city, state"
            onKeyDown={handleKeyPress}
            className="flex-1"
            variant="bordered"
          />
          <Button
            color="primary"
            onPress={handleCustomSubmit}
            isDisabled={!customLocation.trim()}
          >
            <SendIcon className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-center">
          <Button
            variant="light"
            size="sm"
            onPress={() => setShowCustomInput(false)}
          >
            Back to list
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-2">
      <div className="text-center">
        <p className="text-sm text-default-600 mb-4">
          Please select your location:
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {locationOptions.map((location) => (
          <Button
            key={location}
            size="sm"
            variant="bordered"
            onPress={() => handleLocationSelect(location)}
            className="text-xs justify-start"
          >
            {location}
          </Button>
        ))}
        <Button
          size="sm"
          variant="bordered"
          onPress={() => handleLocationSelect("Other")}
          className="text-xs justify-start col-span-2"
        >
          Other (Enter custom location)
        </Button>
      </div>
    </div>
  );
}
