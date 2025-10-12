"use client";

import { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { AgeChatInput } from "~/modules/chat/components/ChatInput/AgeChatInput";
import type { AgeSelection } from "~/modules/chat/components/ChatInput/AgePickerDrawer";

export function MobileSearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParamOpen = searchParams.get("s") === "true";

  // Support both controlled state and URL param
  const drawerIsOpen = isOpen || urlParamOpen;

  const handleClose = () => {
    // Close controlled state
    setIsOpen(false);

    // If opened via URL param, remove it
    if (urlParamOpen) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("s");
      const newUrl = params.toString() ? `?${params.toString()}` : "";
      router.push(window.location.pathname + newUrl);
    }
  };

  const handleAgeSubmit = (ageSelection: AgeSelection) => {
    console.log("Age selected:", ageSelection);
    // Add your age submission logic here
  };

  return (
    <>
      <div className="md:hidden flex-1">
        <Button
          onPress={() => setIsOpen(true)}
          variant="bordered"
          fullWidth
          className="w-full justify-start text-default-400 bg-default-100"
          startContent={<SearchIcon width={16} />}
        >
          What program fits your child?
        </Button>
      </div>
      <Drawer
        scrollBehavior="inside"
        isOpen={drawerIsOpen}
        onClose={handleClose}
        size="full"
        placement="bottom"
        backdrop="opaque"
        hideCloseButton
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.3,
              },
            },
            exit: {
              y: 100,
              opacity: 0,
              transition: {
                duration: 0.3,
              },
            },
          },
        }}
      >
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
      </Drawer>
    </>
  );
}
