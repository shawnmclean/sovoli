"use client";
import type { Program } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { countryCodeToName } from "~/utils/countryUtils";
import { GalleryCarousel } from "~/components/GalleryCarousel";
import { DesktopGallery } from "~/components/DesktopGallery";

export interface ProgramHeroSectionProps {
  orgInstance: OrgInstance;
  program: Program;
  username: string;
}

export const ProgramHeroSection = ({
  orgInstance,
  program,
  username,
}: ProgramHeroSectionProps) => {
  const org = orgInstance.org;
  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "Program";

  // Get primary location
  const primaryLocation = org.locations.find((loc) => loc.isPrimary);

  const admission =
    program.admission ?? program.standardProgramVersion?.admission;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const ageReq = admission?.eligibility.find((r) => r.type === "age");

  const formatAgeRange = (range: {
    minAgeYears?: number;
    maxAgeYears?: number;
  }) => {
    const min = range.minAgeYears ?? 0;
    return range.maxAgeYears
      ? `Ages ${min}-${range.maxAgeYears}`
      : `Ages ${min} and up`;
  };

  // Get social proof from website module (default) or use fallback based on audience
  const socialProof = orgInstance.websiteModule?.defaultSocialProof;

  const formatSocialProof = () => {
    if (socialProof) {
      return `✅ Trusted by ${socialProof.count} ${socialProof.audienceLabel}`;
    }
    // Fallback based on program audience
    return `✅ Trusted by ${program.audience === "parent" ? "parents" : "students"}`;
  };

  return (
    <section className="border-b border-default-200 pb-6 md:border-b-0">
      {/* Mobile Gallery - Full Width */}
      <div className="md:hidden w-full">
        <GalleryCarousel
          media={program.media?.gallery ?? []}
          title={programName}
          type="program"
          username={username}
          id={program.id}
        />
      </div>

      {/* Desktop Gallery + Title Content - Inside Container */}
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-col-reverse gap-6">
          {/* Desktop Gallery Section */}
          <div className="hidden md:block w-full">
            <DesktopGallery
              media={program.media?.gallery ?? []}
              title={programName}
              type="program"
              username={username}
              id={program.id}
            />
          </div>

          {/* Title Content Section */}
          <div className="text-center">
            {/* Program Name */}
            <h1 className="text-2xl leading-tight tracking-tight my-4">
              {programName}
            </h1>

            <p className="text-sm text-foreground-500 max-w-3xl mx-auto">
              {program.quickFacts?.map((fact, index) => (
                <span key={fact}>
                  {fact.replace(
                    "{{age}}",
                    ageReq?.ageRange ? formatAgeRange(ageReq.ageRange) : "",
                  )}
                  {index < (program.quickFacts?.length ?? 0) - 1 && " • "}
                </span>
              ))}
            </p>

            {/* Primary Location */}
            {primaryLocation && (
              <div className="flex justify-center gap-2 text-foreground-500">
                <span className="text-sm">
                  {`${primaryLocation.address.city}`},{" "}
                  {countryCodeToName(primaryLocation.address.countryCode)}
                </span>
              </div>
            )}

            <p className="text-sm text-muted-foreground mt-4">
              {formatSocialProof()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
