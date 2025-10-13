"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { AgePickerDrawer } from "./AgePickerDrawer";
import type { AgeSelection } from "./AgePickerDrawer";

interface AgeChatInputProps {
  onSubmit: (ageSelection: AgeSelection) => void;
  isDisabled?: boolean;
}

export function AgeChatInput({
  onSubmit,
  isDisabled = false,
}: AgeChatInputProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showExtendedAges, setShowExtendedAges] = useState(false);

  const handleAgeSelected = (ageSelection: AgeSelection) => {
    onSubmit(ageSelection);
  };

  const handleOpen2to6Drawer = () => {
    setIsDrawerOpen(true);
  };

  const handleDirectAgeSelect = (years: number) => {
    onSubmit({ years, months: 0 });
  };

  const handleShow10Plus = () => {
    setShowExtendedAges(true);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-2">
        <Button
          size="sm"
          variant="bordered"
          onPress={handleOpen2to6Drawer}
          isDisabled={isDisabled}
        >
          2-6 years
        </Button>
        {[6, 7, 8, 9, 10].map((age) => (
          <Button
            key={age}
            size="sm"
            variant="bordered"
            onPress={() => handleDirectAgeSelect(age)}
            isDisabled={isDisabled}
          >
            {age} years
          </Button>
        ))}
        {!showExtendedAges ? (
          <Button
            size="sm"
            variant="bordered"
            onPress={handleShow10Plus}
            isDisabled={isDisabled}
          >
            10+ years
          </Button>
        ) : (
          <>
            {Array.from({ length: 9 }, (_, i) => i + 11).map((age) => (
              <Button
                key={age}
                size="sm"
                variant="bordered"
                onPress={() => handleDirectAgeSelect(age)}
                isDisabled={isDisabled}
              >
                {age} years
              </Button>
            ))}
          </>
        )}
      </div>

      <AgePickerDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onAgeSelected={handleAgeSelected}
      />
    </>
  );
}
