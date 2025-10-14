"use client";

import { useEffect, useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { ProgramSearchContent } from "../search/ProgramSearchContent";

export function MobileSearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [programsFound, setProgramsFound] = useState(0);
  const searchParams = useSearchParams();
  const urlParamOpen = searchParams.get("s") === "true";

  // Support both controlled state and URL param
  const drawerIsOpen = isOpen || urlParamOpen;

  // Track when search is opened
  useEffect(() => {
    if (drawerIsOpen) {
      const source = urlParamOpen ? "url_param" : "button";
      posthog.capture("mobile_search_opened", {
        source,
      });
    }
  }, [drawerIsOpen, urlParamOpen]);

  const handleClose = () => {
    // Close controlled state
    setIsOpen(false);
    // Reset programs found
    setProgramsFound(0);

    // If opened via URL param, remove it
    if (urlParamOpen) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("s");
      const newUrl = params.toString() ? `?${params.toString()}` : "";
      window.history.pushState({}, "", window.location.pathname + newUrl);
    }
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
                <ProgramSearchContent
                  onSearchComplete={(count) => setProgramsFound(count)}
                />
              </DrawerBody>

              <DrawerFooter className="border-t border-divider p-4">
                <div className="text-sm text-default-500 text-center w-full">
                  {programsFound > 0
                    ? "Select a program to view details"
                    : "Select an age to continue"}
                </div>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
