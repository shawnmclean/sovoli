import { Badge } from "@sovoli/ui/components/badge";
import { Image } from "@sovoli/ui/components/image";
import { UsersIcon, StarIcon } from "lucide-react";

import type { OrgProgram } from "~/modules/academics/types";
import type { OrgInstance } from "~/modules/organisations/types";

export interface ProgramHeroProps {
  orgInstance: OrgInstance;
  program: OrgProgram;
}

export const ProgramHero = ({ orgInstance, program }: ProgramHeroProps) => {
  const org = orgInstance.org;
  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "Program";
  const programDescription =
    program.description ??
    program.standardProgramVersion?.program.description ??
    "";
  const orgLogo = org.logo;

  // Extract age requirements if available
  const ageRequirement = program.requirements?.find(
    (req) => req.type === "age",
  );
  const ageText =
    ageRequirement?.description ?? ageRequirement?.name ?? "Ages 2-16";

  return (
    <section className="relative w-full bg-gradient-to-br from-background via-background to-background-50">
      <div className="container mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            {/* Organization Badge */}
            <div className="flex items-center gap-3">
              {orgLogo && (
                <Image
                  src={orgLogo}
                  alt={org.name}
                  className="h-8 w-8 rounded-lg object-cover"
                />
              )}
              <Badge
                variant="flat"
                color="primary"
                className="text-xs font-medium"
              >
                {org.name}
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                  {programName}
                </span>
              </h1>

              {program.tagline && (
                <p className="text-xl lg:text-2xl text-foreground-600 font-medium">
                  {program.tagline}
                </p>
              )}

              {programDescription && (
                <p className="text-base lg:text-lg text-foreground-500 leading-relaxed max-w-2xl">
                  {programDescription}
                </p>
              )}
            </div>

            {/* Key Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 bg-background-100 rounded-xl border border-background-200">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground-600">
                    Age Range
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {ageText}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-background-100 rounded-xl border border-background-200">
                <div className="flex-shrink-0 w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <StarIcon className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground-600">
                    Quality
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    Excellence
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-6 text-sm text-foreground-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Limited Spots Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span>Early Bird Discount</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
