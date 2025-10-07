"use client";

import { useState, useEffect } from "react";
import { Button } from "@sovoli/ui/components/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import {
  WheelPicker,
  WheelPickerWrapper,
} from "@sovoli/ui/components/wheel-picker";

export interface AgeSelection {
  years: number;
  months: number;
}

interface AgePickerDrawerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAgeSelected: (age: AgeSelection) => void;
  initialAge?: AgeSelection;
}

export function AgePickerDrawer({
  isOpen,
  onOpenChange,
  onAgeSelected,
  initialAge,
}: AgePickerDrawerProps) {
  const [selectedAge, setSelectedAge] = useState<AgeSelection>(
    initialAge ?? { years: 2, months: 0 },
  );

  // Update selectedAge when initialAge changes (when drawer opens with new age)
  useEffect(() => {
    if (initialAge && isOpen) {
      setSelectedAge(initialAge);
    }
  }, [initialAge, isOpen]);

  // Generate year options (0-18 years)
  const yearOptions = Array.from({ length: 19 }, (_, i) => ({
    value: i.toString(),
    label: i === 1 ? "1 year" : `${i} years`,
  }));

  // Generate month options (0-11 months)
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i.toString(),
    label: i === 1 ? "1 month" : `${i} months`,
  }));

  const handleConfirm = () => {
    onAgeSelected(selectedAge);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom"
      size="md"
      backdrop="opaque"
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader
              showBackButton
              onBackPress={onClose}
              startContent={
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    Select Exact Age
                  </span>
                  <span className="text-xs text-default-500">
                    Choose the precise age of your child
                  </span>
                </div>
              }
            />

            <DrawerBody className="p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-default-600">
                    Got it! Please select the exact age:
                  </p>
                </div>

                <div className="flex justify-center">
                  <WheelPickerWrapper>
                    <WheelPicker
                      options={yearOptions}
                      value={selectedAge.years.toString()}
                      onValueChange={(value) =>
                        setSelectedAge((prev) => ({
                          ...prev,
                          years: parseInt(value),
                        }))
                      }
                    />
                    <WheelPicker
                      options={monthOptions}
                      value={selectedAge.months.toString()}
                      onValueChange={(value) =>
                        setSelectedAge((prev) => ({
                          ...prev,
                          months: parseInt(value),
                        }))
                      }
                    />
                  </WheelPickerWrapper>
                </div>

                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    Selected: {selectedAge.years} year
                    {selectedAge.years !== 1 ? "s" : ""} {selectedAge.months}{" "}
                    month{selectedAge.months !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </DrawerBody>

            <DrawerFooter className="flex flex-row gap-2">
              <Button
                variant="bordered"
                onPress={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleConfirm}
                className="flex-1"
              >
                Confirm Age
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
