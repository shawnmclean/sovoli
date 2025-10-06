"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { AgePickerDrawer } from "./AgePickerDrawer";
import type { AgeSelection } from "../../types/guided-chat";

interface AgeChatInputProps {
  onSubmit: (value: string) => void;
}

export function AgeChatInput({ onSubmit }: AgeChatInputProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Age button options
  const ageOptions = [
    "2 years",
    "3 years",
    "4 years",
    "5 years",
    "6 years",
    "7 years",
    "8+ years",
  ];

  const handleAgeSelected = (ageSelection: AgeSelection) => {
    onSubmit(formatAgeSelection(ageSelection));
  };

  const formatAgeSelection = (ageSelection: AgeSelection): string => {
    const { years, months } = ageSelection;
    if (years === 0 && months === 0) {
      return "Newborn";
    }
    if (years === 0) {
      return months === 1 ? "1 month" : `${months} months`;
    }
    if (months === 0) {
      return years === 1 ? "1 year" : `${years} years`;
    }
    return `${years} year${years !== 1 ? "s" : ""} ${months} month${months !== 1 ? "s" : ""}`;
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-2">
        {ageOptions.map((option) => (
          <Button
            key={option}
            size="sm"
            variant="bordered"
            onPress={() => setIsDrawerOpen(true)}
          >
            {option}
          </Button>
        ))}
      </div>

      <AgePickerDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onAgeSelected={handleAgeSelected}
      />
    </>
  );
}
