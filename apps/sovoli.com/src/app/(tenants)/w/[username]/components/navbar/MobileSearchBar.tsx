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
import { ProgramSearchContent } from "../search/ProgramSearchContent";

export function MobileSearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [programsFound, setProgramsFound] = useState(0);

  const handleClose = () => {
    setIsOpen(false);
    setProgramsFound(0);
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
        isOpen={isOpen}
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
                  source="mobile_drawer"
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
