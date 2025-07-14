import { Badge } from "@sovoli/ui/components/badge";
import { Image } from "@sovoli/ui/components/image";
import { Divider } from "@sovoli/ui/components/divider";
import { MapPinIcon } from "lucide-react";

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

  // Get primary location
  const primaryLocation = org.locations.find((loc) => loc.isPrimary);

  return (
    <section className="relative w-full bg-gradient-to-br from-background via-background to-background-50">
      <div className="container mx-auto max-w-7xl px-4 py-12 lg:py-16">
        {/* Top Section - Centered Program Info */}
        <div className="text-center space-y-6 mb-8">
          {/* Program Name */}
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
              {programName}
            </span>
          </h1>

          {/* Tagline */}
          {program.tagline && (
            <p className="text-lg lg:text-xl text-foreground-600 font-medium max-w-3xl mx-auto">
              {program.tagline}
            </p>
          )}

          {/* Primary Location */}
          {primaryLocation && (
            <div className="flex items-center justify-center gap-2 text-foreground-500">
              <MapPinIcon className="h-4 w-4" />
              <span className="text-sm">
                {`${primaryLocation.address.city}`}
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <Divider className="my-8" />

        {/* Bottom Section - Organization and Details */}
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

            {/* Program Description */}
            {programDescription && (
              <p className="text-base lg:text-lg text-foreground-500 leading-relaxed max-w-2xl">
                {programDescription}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
