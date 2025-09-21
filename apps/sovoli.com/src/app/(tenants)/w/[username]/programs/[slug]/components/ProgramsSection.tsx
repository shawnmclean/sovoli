"use client";

import type { Program } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import { UserIcon } from "lucide-react";
import { ProgramSectionsWrapper } from "./ProgramSectionsWrapper";
import { CldImage } from "next-cloudinary";

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

export interface ProgramsSectionProps {
  orgInstance: OrgInstance;
  currentProgram: Program;
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
    <ProgramSectionsWrapper program={currentProgram} section="programs">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Other Programs
        </h2>
        <p className="text-sm text-muted-foreground">
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
              const programImage = program.photos?.[0];

              // Get age requirement for this program
              const admission =
                program.admission ?? program.standardProgramVersion?.admission;
              const ageReq = admission?.eligibility.find(
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                (r) => r.type === "age",
              );

              return (
                <CarouselItem key={program.slug} className="pl-4 basis-[280px]">
                  <Link href={`/programs/${program.slug}`}>
                    <Card className="overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-card">
                      <div className="relative h-32 w-full">
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
                      <CardBody className="p-4">
                        <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-2">
                          {programName}
                        </h3>
                        {ageReq?.ageRange && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
    </ProgramSectionsWrapper>
  );
}
