"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { AgePickerDrawer } from "./AgePickerDrawer";
import type { AgeSelection } from "./AgePickerDrawer";

interface AgeChatInputProps {
  onSubmit: (ageSelection: AgeSelection) => void;
}

export function AgeChatInput({ onSubmit }: AgeChatInputProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedInitialAge, setSelectedInitialAge] = useState<
    AgeSelection | undefined
  >();

  // Age button options as tuples [label, AgeSelection]
  const ageOptions: [string, AgeSelection][] = [
    ["2 years", { years: 2, months: 0 }],
    ["3 years", { years: 3, months: 0 }],
    ["4 years", { years: 4, months: 0 }],
    ["5 years", { years: 5, months: 0 }],
    ["6 years", { years: 6, months: 0 }],
    ["7 years", { years: 7, months: 0 }],
    ["8+ years", { years: 8, months: 0 }],
  ];

  const handleAgeSelected = (ageSelection: AgeSelection) => {
    onSubmit(ageSelection);
  };

  const handleAgeButtonClick = (ageSelection: AgeSelection) => {
    setSelectedInitialAge(ageSelection);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-2">
        {ageOptions.map(([label, ageSelection]) => (
          <Button
            key={label}
            size="sm"
            variant="bordered"
            onPress={() => handleAgeButtonClick(ageSelection)}
          >
            {label}
          </Button>
        ))}
      </div>

      <AgePickerDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onAgeSelected={handleAgeSelected}
        initialAge={selectedInitialAge}
      />
    </>
  );
}
