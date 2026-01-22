"use client";

import { Button } from "@sovoli/ui/components/button";
import { Chip } from "@sovoli/ui/components/chip";
import { PartyPopperIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import type { Program } from "~/modules/academics/types";

interface ActivitiesSectionProps {
  program: Program;
}

export function ActivitiesSection({ program }: ActivitiesSectionProps) {
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
    <section className="my-6 border-b border-default-200 pb-6">
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
            <div className="flex justify-center">
              <Button
                variant="flat"
                color="default"
                className="mt-3"
                fullWidth
                href={`/programs/${program.slug}/activities`}
                as={Link}
              >
                See all {activities.length} activities
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
