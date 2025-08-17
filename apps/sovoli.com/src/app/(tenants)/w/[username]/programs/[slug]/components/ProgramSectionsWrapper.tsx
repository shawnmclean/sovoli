"use client";

import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { Divider } from "@sovoli/ui/components/divider";
import { trackProgramAnalytics } from "../lib/programAnalytics";
import type { Program, ProgramCycle } from "~/modules/academics/types";

interface ProgramSectionsWrapperProps {
  children: React.ReactNode;
  section: string;
  program: Program;
  cycle?: ProgramCycle;
  className?: string;
  sectionClickable?: boolean;
  detailedView?: React.ReactNode;
  detailedViewTrigger?: (onOpen: () => void) => React.ReactNode;
  detailedViewTitle?: string;
}

export function ProgramSectionsWrapper({
  children,
  program,
  section,
  cycle,
  className,
  sectionClickable = false,
  detailedView,
  detailedViewTrigger,
  detailedViewTitle,
}: ProgramSectionsWrapperProps) {
  const { isOpen: isDetailedViewOpen, onOpen, onOpenChange } = useDisclosure();

  const handleOpenDetailedView = () => {
    if (!detailedView) return;

    trackProgramAnalytics("SectionOpened", program, cycle, {
      section: section,
    });
    onOpen();
  };

  const shouldShowDetailedView = Boolean(detailedView);
  const isSectionClickable = sectionClickable && shouldShowDetailedView;

  return (
    <section
      className={className}
      onClick={isSectionClickable ? handleOpenDetailedView : undefined}
      style={isSectionClickable ? { cursor: "pointer" } : undefined}
    >
      {children}

      {/* Render the trigger if provided */}
      {detailedViewTrigger && (
        <div className="mt-4">
          {detailedViewTrigger(handleOpenDetailedView)}
        </div>
      )}

      <Divider className="mx-auto max-w-2xl my-6" />

      {/* Drawer for detailed view */}
      {shouldShowDetailedView && (
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
              onBackPress={onOpenChange}
            />
            <DrawerBody className="mt-4">{detailedView}</DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </section>
  );
}
