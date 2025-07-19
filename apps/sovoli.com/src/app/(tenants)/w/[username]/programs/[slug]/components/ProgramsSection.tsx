"use client";

import type { OrgProgram } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import Image from "next/image";
import { UserIcon } from "lucide-react";

// Helper function to display age range
const displayAgeRange = (ageRange?: {
  minAgeYears?: number;
  maxAgeYears?: number;
  minAgeMonths?: number;
  maxAgeMonths?: number;
}): string => {
  if (!ageRange) return "";

  const minAgeParts: string[] = [];
  const maxAgeParts: string[] = [];

  // Build minimum age string
  if (ageRange.minAgeYears !== undefined && ageRange.minAgeYears > 0) {
    minAgeParts.push(`${ageRange.minAgeYears} years`);
  }
  if (ageRange.minAgeMonths !== undefined && ageRange.minAgeMonths > 0) {
    minAgeParts.push(`${ageRange.minAgeMonths} months`);
  }

  // Build maximum age string
  if (ageRange.maxAgeYears !== undefined && ageRange.maxAgeYears > 0) {
    maxAgeParts.push(`${ageRange.maxAgeYears} years`);
  }
  if (ageRange.maxAgeMonths !== undefined && ageRange.maxAgeMonths > 0) {
    maxAgeParts.push(`${ageRange.maxAgeMonths} months`);
  }

  // Combine min and max age into a single display string
  const minAgeDisplay = minAgeParts.join(" ");
  const maxAgeDisplay = maxAgeParts.join(" ");

  if (minAgeDisplay && maxAgeDisplay) {
    return `${minAgeDisplay} - ${maxAgeDisplay}`;
  } else if (minAgeDisplay) {
    return minAgeDisplay;
  } else if (maxAgeDisplay) {
    return maxAgeDisplay;
  }

  return "";
};

export interface ProgramsSectionProps {
  orgInstance: OrgInstance;
  currentProgram: OrgProgram;
}

export function ProgramsSection({
  orgInstance,
  currentProgram,
}: ProgramsSectionProps) {
  // Get all programs from the organization, excluding the current one
  const allPrograms = orgInstance.academicModule?.programs ?? [];
  const otherPrograms = allPrograms.filter(
    (program) => program.slug !== currentProgram.slug,
  );

  // Don't render if there are no other programs
  if (otherPrograms.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-foreground">Other Programs</h2>
          <p className="text-sm text-foreground-600">
            Explore our other educational offerings
          </p>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {otherPrograms.map((program) => {
                const programName =
                  program.name ??
                  program.standardProgramVersion?.program.name ??
                  "Program";
                const programImage =
                  program.photos?.[0]?.url ??
                  program.standardProgramVersion?.program.image ??
                  "/orgs/defaults/programs/nursery.webp";

                // Get age requirement for this program
                const ageReq =
                  program.requirements?.find((r) => r.type === "age") ??
                  program.standardProgramVersion?.requirements?.find(
                    (r) => r.type === "age",
                  );

                return (
                  <CarouselItem
                    key={program.slug}
                    className="pl-4 basis-[220px]"
                  >
                    <Link href={`/programs/${program.slug}`}>
                      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="relative h-20 w-full">
                          <Image
                            src={programImage}
                            alt={programName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardBody className="p-3">
                          <h3 className="font-semibold text-foreground text-xs line-clamp-1 mb-2">
                            {programName}
                          </h3>
                          {ageReq?.ageRange && (
                            <div className="flex items-center gap-1 text-xs text-foreground-500">
                              <UserIcon className="w-3 h-3 text-foreground-500" />
                              {displayAgeRange(ageReq.ageRange)}
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
