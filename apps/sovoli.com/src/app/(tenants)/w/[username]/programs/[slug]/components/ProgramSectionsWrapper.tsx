"use client";

import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { Divider } from "@sovoli/ui/components/divider";
import posthog from "posthog-js";
import type { Program } from "~/modules/academics/types";

interface ProgramSectionsWrapperProps {
  children: React.ReactNode;
  program: Program;
  className?: string;
  sectionClickable?: boolean;
  detailedView?: React.ReactNode;
  detailedViewTrigger?: (onOpen: () => void) => React.ReactNode;
  detailedViewTitle?: string;
}

export function ProgramSectionsWrapper({
  children,
  program,
  className,
  sectionClickable = false,
  detailedView,
  detailedViewTrigger,
  detailedViewTitle,
}: ProgramSectionsWrapperProps) {
  const { isOpen: isDetailedViewOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSectionClick = () => {
    if (sectionClickable && detailedView) {
      posthog.capture("program_section_expanded", {
        program_id: program.id,
        section_title: detailedViewTitle ?? "Unknown",
        section_type: "detailed_view",
      });
      onOpen();
    }
  };

  const handleTriggerClick = () => {
    posthog.capture("program_section_expanded", {
      program_id: program.id,
      section_title: detailedViewTitle ?? "Unknown",
      section_type: "detailed_view",
    });
    onOpen();
  };

  const handleBackPress = () => {
    onOpenChange();
  };

  return (
    <section
      className={className}
      onClick={
        sectionClickable && detailedView ? handleSectionClick : undefined
      }
      style={
        sectionClickable && detailedView ? { cursor: "pointer" } : undefined
      }
    >
      {children}

      {/* Render the trigger if provided */}
      {detailedViewTrigger && (
        <div className="mt-4">{detailedViewTrigger(handleTriggerClick)}</div>
      )}

      <Divider className="mx-auto max-w-2xl my-6" />

      {/* Drawer for detailed view */}
      {detailedView && (
        <Drawer
          isOpen={isDetailedViewOpen}
          size="full"
          placement="bottom"
          backdrop="opaque"
          onOpenChange={onOpenChange}
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
            <DrawerHeader
              title={detailedViewTitle ?? "Details"}
              showBackButton
              onBackPress={handleBackPress}
            />
            <DrawerBody className="mt-4">{detailedView}</DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </section>
  );
}
