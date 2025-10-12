"use client";

import {
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { AgeChatInput } from "~/modules/chat/components/ChatInput/AgeChatInput";
import type { AgeSelection } from "~/modules/chat/components/ChatInput/AgePickerDrawer";

export interface SearchDialogProps {
  onAgeSubmit?: (ageSelection: AgeSelection) => void;
}

export function SearchDialog({ onAgeSubmit }: SearchDialogProps) {
  const handleAgeSubmit = (ageSelection: AgeSelection) => {
    console.log("Age selected:", ageSelection);
    onAgeSubmit?.(ageSelection);
  };

  return (
    <DrawerContent>
      {(onClose) => (
        <>
          <DrawerHeader
            showBackButton
            onBackPress={onClose}
            className="border-b border-divider"
          >
            <span className="text-lg font-semibold">Search</span>
          </DrawerHeader>

          <DrawerBody className="p-4">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-base font-medium mb-2">
                  How old is your child?
                </h2>
                <AgeChatInput onSubmit={handleAgeSubmit} />
              </div>
            </div>
          </DrawerBody>

          <DrawerFooter className="border-t border-divider p-4">
            <div className="text-sm text-default-500 text-center w-full">
              Select an age to continue
            </div>
          </DrawerFooter>
        </>
      )}
    </DrawerContent>
  );
}
