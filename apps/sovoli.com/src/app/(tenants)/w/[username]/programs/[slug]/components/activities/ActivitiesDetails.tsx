"use client";

import { useMemo } from "react";
import { PartyPopperIcon } from "lucide-react";
import type { Program } from "~/modules/academics/types";
import { trackProgramAnalytics } from "../../lib/programAnalytics";
import { useEffect } from "react";
import {
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@sovoli/ui/components/drawer";
import { SubscribeProgramButton } from "../SubscribeProgramButton";
import { ShareButton } from "~/app/[username]/(profile)/components/OrgNavbar/ShareButton";

interface ActivitiesDetailsProps {
  program: Program;
}

export function ActivitiesDetails({ program }: ActivitiesDetailsProps) {
  const activities = useMemo(() => {
    return program.activities ?? [];
  }, [program]);

  // Track analytics when component mounts
  useEffect(() => {
    trackProgramAnalytics("SectionOpened", program, null, {
      section: "activities",
    });
  }, [program]);

  if (activities.length === 0) {
    return null;
  }

  return (
    <DrawerContent>
      {(onClose) => (
        <>
          <DrawerHeader
            showBackButton
            onBackPress={onClose}
            endContent={
              <>
                <ShareButton
                  title="Share"
                  variant="light"
                  text={`Check out ${program.name} activities.`}
                />
                <SubscribeProgramButton program={program} variant="light" />
              </>
            }
          />
          <DrawerBody>
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <PartyPopperIcon className="h-6 w-6 text-primary" />
                Activities & Celebrations
              </h1>

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
            </div>
          </DrawerBody>
        </>
      )}
    </DrawerContent>
  );
}
