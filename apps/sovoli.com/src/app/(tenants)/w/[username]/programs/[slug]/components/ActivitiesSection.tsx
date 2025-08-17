"use client";

import { useMemo } from "react";
import { Chip } from "@sovoli/ui/components/chip";
import { Button } from "@sovoli/ui/components/button";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { PartyPopperIcon } from "lucide-react";
import type { Program } from "~/modules/academics/types";
import { ProgramSectionsWrapper } from "./ProgramSectionsWrapper";

interface ActivitiesSectionProps {
  program: Program;
}

export function ActivitiesSection({ program }: ActivitiesSectionProps) {
  const {
    isOpen: isActivitiesOpen,
    onOpen: onActivitiesOpen,
    onOpenChange: onActivitiesOpenChange,
  } = useDisclosure();

  const activities = useMemo(() => {
    return program.activities ?? [];
  }, [program]);

  // Show first 6 activities
  const firstSixActivities = activities.slice(0, 6);
  const hasMoreActivities = activities.length > 6;

  if (activities.length === 0) {
    return null;
  }

  return (
    <ProgramSectionsWrapper>
      <div className="overflow-hidden">
        <div className="pb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <PartyPopperIcon className="h-6 w-6 text-primary" />
            Activities & Celebrations
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {firstSixActivities.map((activity, index) => (
              <Chip key={index} color="primary" variant="flat" size="sm">
                {activity.title}
              </Chip>
            ))}
            {hasMoreActivities && (
              <Chip color="primary" variant="flat" size="sm">
                +{activities.length - 6} more
              </Chip>
            )}
          </div>
          {hasMoreActivities && (
            <Button
              variant="flat"
              color="default"
              onPress={onActivitiesOpen}
              className="mt-3"
              fullWidth
            >
              See all {activities.length} activities
            </Button>
          )}
        </div>
      </div>

      {/* Drawer for activities */}
      <Drawer
        isOpen={isActivitiesOpen}
        size="full"
        placement="bottom"
        backdrop="opaque"
        onOpenChange={onActivitiesOpenChange}
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
            title="All Activities & Celebrations"
            showBackButton
            onBackPress={onActivitiesOpenChange}
          />
          <DrawerBody className="mt-4">
            {activities.length > 0 && (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 bg-default-50 rounded-lg border border-default-200"
                  >
                    <h4 className="font-semibold text-foreground mb-2">
                      {activity.title}
                    </h4>
                  </div>
                ))}
              </div>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </ProgramSectionsWrapper>
  );
}
