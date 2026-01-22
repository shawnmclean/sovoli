"use client";

import { Card, CardBody } from "@sovoli/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import { Link } from "@sovoli/ui/components/link";
import { ArrowRightIcon, UserIcon } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { getProgramImage } from "~/modules/academics/getProgramImage";
import type { AgeEligibility, Program } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";

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

// Helper function to get minimum age for sorting
const getMinAgeForSorting = (program: Program): number => {
  const ageReq = getAgeRequirement(program);
  if (ageReq?.ageRange?.minAgeYears !== undefined) {
    return ageReq.ageRange.minAgeYears;
  }
  // Fallback: try to infer from program slug/name if no age range
  // This handles edge cases where age might not be explicitly set
  return 999; // High number to push programs without age to the end
};

const getProgramGroup = (
  program: Program,
): (Program["group"] & { order?: number }) | undefined =>
  program.group ?? program.standardProgramVersion?.program.group;

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

function getProgramCategoryChain(program: Program) {
  const chain: NonNullable<Program["category"]>[] = [];
  // Check program.category first, then fall back to standardProgramVersion.program.category
  let current =
    program.category ?? program.standardProgramVersion?.program.category;

  while (current) {
    chain.push(current);
    current = current.parent;
  }

  return chain.reverse();
}

export function ProgramGroupListing({ orgInstance }: ProgramGroupListingProps) {
  const programs = orgInstance.academicModule?.programs ?? [];

  if (programs.length === 0) {
    return null;
  }

  const hasCategories = programs.some((program) =>
    Boolean(
      program.category ?? program.standardProgramVersion?.program.category,
    ),
  );
  const hasProgramGroups = programs.some((program) =>
    Boolean(getProgramGroup(program)),
  );
  const isPrivateSchool = orgInstance.org.categories.includes("private-school");

  const categorySections = (() => {
    if (!hasCategories) return null;

    // Group programs by category
    const byCategory = new Map<
      string,
      {
        title: string;
        programs: Program[];
      }
    >();

    for (const program of programs) {
      const chain = getProgramCategoryChain(program);
      // Use the parent category (one level up from leaf) for grouping
      // If chain has 2+ levels, use the parent (second-to-last)
      // If chain has only 1 level, use the leaf category
      const category =
        chain.length >= 2 ? chain[chain.length - 2] : chain[chain.length - 1];
      const categoryKey = category?.id ?? "other";
      const categoryTitle = category?.name ?? "Other Programs";

      const categoryEntry =
        byCategory.get(categoryKey) ??
        (() => {
          const next = { title: categoryTitle, programs: [] as Program[] };
          byCategory.set(categoryKey, next);
          return next;
        })();

      categoryEntry.programs.push(program);
    }

    // Separate categories with multiple programs from those with single programs
    const multiProgramCategories: {
      id: string;
      title: string;
      programs: Program[];
    }[] = [];
    const singleProgramCategories: Program[] = [];

    for (const [id, category] of byCategory.entries()) {
      // Categories with MORE than one program get their own section
      if (category.programs.length > 1) {
        multiProgramCategories.push({
          id,
          title: category.title,
          programs: category.programs.sort((a, b) => {
            const minAgeA = getMinAgeForSorting(a);
            const minAgeB = getMinAgeForSorting(b);

            // Primary sort: by minimum age
            if (minAgeA !== minAgeB) {
              return minAgeA - minAgeB;
            }

            // Secondary sort: by name (for programs with same age)
            const nameA =
              a.name ?? a.standardProgramVersion?.program.name ?? a.slug;
            const nameB =
              b.name ?? b.standardProgramVersion?.program.name ?? b.slug;
            return nameA.localeCompare(nameB);
          }),
        });
      } else {
        // Categories with only one program go into "More programs"
        singleProgramCategories.push(...category.programs);
      }
    }

    // Sort categories with multiple programs by title
    multiProgramCategories.sort((a, b) => a.title.localeCompare(b.title));

    // Add "More programs" section at the end if there are single-program categories
    if (singleProgramCategories.length > 0) {
      multiProgramCategories.push({
        id: "more-programs",
        title: "More programs",
        programs: singleProgramCategories.sort((a, b) => {
          const minAgeA = getMinAgeForSorting(a);
          const minAgeB = getMinAgeForSorting(b);

          // Primary sort: by minimum age
          if (minAgeA !== minAgeB) {
            return minAgeA - minAgeB;
          }

          // Secondary sort: by name
          const nameA =
            a.name ?? a.standardProgramVersion?.program.name ?? a.slug;
          const nameB =
            b.name ?? b.standardProgramVersion?.program.name ?? b.slug;
          return nameA.localeCompare(nameB);
        }),
      });
    }

    // Return all categories (those with multiple programs + "More programs" if needed)
    return multiProgramCategories.length > 0 ? multiProgramCategories : null;
  })();

  const fallbackGroups = (() => {
    // Fallback (when no category is available):
    // - use Program Groups if present (FitRight)
    // - else Private schools: group by age eligibility
    // - else: show a single list (no group concept)
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
        const group = getProgramGroup(program);
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

      const groups = Array.from(byGroup.values());
      const singleProgramGroups = groups.filter(
        (group) => group.programs.length === 1,
      );
      const multiProgramGroups = groups.filter(
        (group) => group.programs.length > 1,
      );

      if (singleProgramGroups.length > 0) {
        const otherPrograms = singleProgramGroups.flatMap(
          (group) => group.programs,
        );
        multiProgramGroups.push({
          title: "Other Programs",
          order: 999,
          programs: otherPrograms,
        });
      }

      return multiProgramGroups.sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return a.title.localeCompare(b.title);
      });
    }

    if (!isPrivateSchool) {
      return [{ title: "Programs", programs }];
    }

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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground mb-1">
          Featured Programs
        </h2>
        <Link
          href="/programs"
          className="text-sm text-white underline flex items-center gap-1"
        >
          View all
          <ArrowRightIcon className="w-3 h-3" />
        </Link>
      </div>
      {categorySections
        ? categorySections.map((category) => {
            return (
              <div key={category.id} className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    {category.title}
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
                      {category.programs.map((program) => {
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
                                      <span>
                                        {formatAgeRange(ageReq.ageRange)}
                                      </span>
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
            );
          })
        : fallbackGroups.map((group, idx) => {
            const shouldShowHeader =
              hasProgramGroups ||
              (isPrivateSchool && fallbackGroups.length > 1);

            return (
              <div key={`${group.title}-${idx}`} className="space-y-4">
                {shouldShowHeader && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">
                      {group.title}
                    </h2>
                  </div>
                )}

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
                                      <span>
                                        {formatAgeRange(ageReq.ageRange)}
                                      </span>
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
            );
          })}
    </div>
  );
}
