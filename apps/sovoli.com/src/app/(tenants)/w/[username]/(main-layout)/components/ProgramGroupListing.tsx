"use client";

import type { Program, AgeEligibility } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import { UserIcon } from "lucide-react";
import { CldImage } from "next-cloudinary";

export interface ProgramGroupListingProps {
  orgInstance: OrgInstance;
}

// Helper function to display age range
const formatAgeRange = (range: {
  minAgeYears?: number;
  maxAgeYears?: number;
}) => {
  const min = range.minAgeYears ?? 0;
  return range.maxAgeYears
    ? `Ages ${min}-${range.maxAgeYears}`
    : `Ages ${min} and up`;
};

// Helper function to get age requirement from program
const getAgeRequirement = (program: Program): AgeEligibility | undefined => {
  const admission =
    program.admission ?? program.standardProgramVersion?.admission;
  return admission?.eligibility[0]; // Since EligibilityRule is just AgeEligibility
};

// Helper function to get age group name based on age range
const getAgeGroupName = (ageReq: AgeEligibility | undefined) => {
  if (!ageReq?.ageRange) return "All Ages";

  const { minAgeYears, maxAgeYears } = ageReq.ageRange;

  if (minAgeYears === undefined && maxAgeYears === undefined) return "All Ages";

  if (maxAgeYears === undefined) {
    if (minAgeYears && minAgeYears >= 18) return "Adult Programs";
    if (minAgeYears && minAgeYears >= 13) return "Teen Programs";
    if (minAgeYears && minAgeYears >= 6) return "Primary Programs";
    if (minAgeYears && minAgeYears >= 3) return "Early Childhood";
    return "Infant Programs";
  }

  if (maxAgeYears <= 2) return "Infant Programs";
  if (maxAgeYears <= 5) return "Early Childhood";
  if (maxAgeYears <= 11) return "Primary Programs";
  if (maxAgeYears <= 17) return "Secondary Programs";
  return "Adult Programs";
};

// Helper function to get sorting order for age groups
const getAgeGroupOrder = (ageGroupName: string) => {
  const order: Record<string, number> = {
    "Infant Programs": 1,
    "Early Childhood": 2,
    "Primary Programs": 3,
    "Secondary Programs": 4,
    "Adult Programs": 5,
    "All Ages": 6,
  };
  return order[ageGroupName] ?? 999;
};

export function ProgramGroupListing({ orgInstance }: ProgramGroupListingProps) {
  const programs = orgInstance.academicModule?.programs ?? [];

  if (programs.length === 0) {
    return null;
  }

  // Group programs by age groups
  const programsByAgeGroup = programs.reduce(
    (acc, program) => {
      const ageReq = getAgeRequirement(program);
      const ageGroupName = getAgeGroupName(ageReq);

      if (!acc[ageGroupName]) {
        acc[ageGroupName] = [];
      }
      acc[ageGroupName].push(program);
      return acc;
    },
    {} as Record<string, Program[]>,
  );

  // Sort age groups by order
  const sortedAgeGroups = Object.entries(programsByAgeGroup).sort(
    ([a], [b]) => getAgeGroupOrder(a) - getAgeGroupOrder(b),
  );

  return (
    <div className="space-y-8">
      {sortedAgeGroups.map(([ageGroupName, groupPrograms]) => (
        <div key={ageGroupName} className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {ageGroupName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {groupPrograms.length} program
              {groupPrograms.length !== 1 ? "s" : ""} available
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
              <CarouselContent className="-ml-1">
                {groupPrograms.map((program) => {
                  const programName =
                    program.name ??
                    program.standardProgramVersion?.program.name ??
                    "Program";
                  const programImage = program.photos?.[0];
                  const ageReq = getAgeRequirement(program);

                  return (
                    <CarouselItem
                      key={program.slug}
                      className="pl-1 basis-[200px]"
                    >
                      <Link href={`/programs/${program.slug}`}>
                        <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-card h-full">
                          <div className="relative h-28 w-full">
                            {programImage ? (
                              <>
                                <CldImage
                                  src={programImage.publicId}
                                  alt={programName}
                                  width={programImage.width}
                                  height={programImage.height}
                                  className="object-cover w-full h-full"
                                />
                                {/* Gradient overlay for better text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              </>
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                <div className="text-4xl text-muted-foreground">
                                  📚
                                </div>
                              </div>
                            )}
                          </div>
                          <CardBody className="p-3">
                            <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-1">
                              {programName}
                            </h3>
                            {ageReq?.ageRange && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <UserIcon className="w-3 h-3 flex-shrink-0" />
                                <span>{formatAgeRange(ageReq.ageRange)}</span>
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
      ))}
    </div>
  );
}
