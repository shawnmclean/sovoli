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
import { getProgramImage } from "~/modules/academics/getProgramImage";

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

  if (maxAgeYears <= 2) return "Infant";
  if (maxAgeYears <= 5) return "Early Childhood";
  if (maxAgeYears <= 11) return "Primary";
  if (maxAgeYears <= 17) return "Secondary";
  return "Adult";
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

  const hasProgramGroups = programs.some((program) => Boolean(program.group));

  const groups = (() => {
    if (hasProgramGroups) {
      const byGroup = new Map<
        string,
        {
          title: string;
          order?: number;
          programs: Program[];
        }
      >();

      for (const program of programs) {
        const group = program.group as (Program["group"] & { order?: number }) | undefined;
        const key = group?.id ?? group?.slug ?? "other";
        const title = group?.name ?? "Other Programs";
        const order = group?.order;

        const existing = byGroup.get(key);
        if (existing) {
          existing.programs.push(program);
        } else {
          byGroup.set(key, { title, order, programs: [program] });
        }
      }

      return Array.from(byGroup.values()).sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return a.title.localeCompare(b.title);
      });
    }

    // Fallback: group programs by age eligibility
    const programsByAgeGroup = programs.reduce(
      (acc, program) => {
        const ageReq = getAgeRequirement(program);
        const ageGroupName = getAgeGroupName(ageReq);

        acc[ageGroupName] ??= [];
        acc[ageGroupName].push(program);
        return acc;
      },
      {} as Record<string, Program[]>,
    );

    return Object.entries(programsByAgeGroup)
      .sort(([a], [b]) => getAgeGroupOrder(a) - getAgeGroupOrder(b))
      .map(([title, programs]) => ({ title, programs }));
  })();

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.title} className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">
              {group.title}
            </h2>
          </div>

          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {group.programs.map((program) => {
                  const programName =
                    program.name ??
                    program.standardProgramVersion?.program.name ??
                    "Program";
                  const programImage = getProgramImage(program);
                  const ageReq = getAgeRequirement(program);

                  return (
                    <CarouselItem
                      key={program.slug}
                      className="pl-2 basis-[216px] shrink-0"
                    >
                      <Link
                        href={`/programs/${program.slug}`}
                        className="block w-full"
                      >
                        <Card className="overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-card h-full w-[200px] flex flex-col mr-4">
                          <div className="relative aspect-square w-full">
                            {programImage ? (
                              <>
                                <CldImage
                                  src={programImage.publicId}
                                  alt={programName}
                                  width={200}
                                  height={200}
                                  crop="fill"
                                  sizes="200px"
                                  quality="auto"
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
                          <CardBody className="p-3 flex-1 flex flex-col justify-between">
                            <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-1">
                              {programName}
                            </h3>
                            {ageReq?.ageRange && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <UserIcon className="w-3 h-3 shrink-0" />
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
