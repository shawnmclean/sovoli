import type { Project } from "~/modules/projects/types";
import type { OrgInstance } from "~/modules/organisations/types";
import type { OrgLocation } from "~/modules/organisations/types";
import { countryCodeToName } from "~/utils/countryUtils";
import { formatTimeline } from "~/app/(temp)/projects/lib/formatters";

export interface ProjectHeroSectionProps {
  orgInstance: OrgInstance;
  project: Project;
  location?: OrgLocation;
}

export const ProjectHeroSection = ({
  orgInstance,
  project,
  location,
}: ProjectHeroSectionProps) => {
  const timeline = formatTimeline(project.startDate, project.endDate);
  const needsCount = project.needs?.length ?? 0;

  // Build quick facts array
  const quickFacts: string[] = [];

  if (project.status) {
    quickFacts.push(
      project.status.charAt(0).toUpperCase() + project.status.slice(1),
    );
  }

  if (project.category) {
    quickFacts.push(
      project.category.charAt(0).toUpperCase() + project.category.slice(1),
    );
  }

  if (needsCount > 0) {
    quickFacts.push(`${needsCount} ${needsCount === 1 ? "need" : "needs"}`);
  }

  // Get primary location or use provided location
  const displayLocation =
    location ??
    orgInstance.org.locations.find((loc) => loc.isPrimary) ??
    orgInstance.org.locations[0];

  // Format full address
  const formatFullAddress = (
    loc: OrgLocation | undefined,
  ): string | undefined => {
    if (!loc) return undefined;

    const addressParts: string[] = [];

    // Add address lines
    if (loc.address.line1) addressParts.push(loc.address.line1);
    if (loc.address.line2) addressParts.push(loc.address.line2);
    if (loc.address.line3) addressParts.push(loc.address.line3);

    // Add city
    if (loc.address.city) addressParts.push(loc.address.city);

    // Add state
    if (loc.address.state) addressParts.push(loc.address.state);

    // Add country
    if (loc.address.countryCode) {
      const countryName = countryCodeToName(loc.address.countryCode);
      if (countryName) {
        addressParts.push(countryName);
      }
    }

    return addressParts.length > 0 ? addressParts.join(", ") : undefined;
  };

  const fullAddress = formatFullAddress(displayLocation);

  return (
    <section className="mb-6 border-b border-default-200 pb-6 text-center sm:mb-8 sm:pb-8">
      {/* Project Title */}
      <h1 className="my-4 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
        {project.title}
      </h1>

      {/* Quick Facts */}
      {quickFacts.length > 0 && (
        <p className="mx-auto max-w-3xl text-xs text-foreground-500 sm:text-sm">
          {quickFacts.map((fact, index) => (
            <span key={fact}>
              {fact}
              {index < quickFacts.length - 1 && " • "}
            </span>
          ))}
        </p>
      )}

      {/* Timeline */}
      {timeline && (
        <p className="mx-auto mt-2 max-w-3xl text-xs text-foreground-500 sm:text-sm">
          {timeline}
        </p>
      )}

      {/* Address */}
      {fullAddress && (
        <div className="mt-2 flex justify-center text-foreground-500">
          <span className="text-xs sm:text-sm">{fullAddress}</span>
        </div>
      )}

      {/* Trust/Support Badge */}
      {needsCount > 0 && (
        <p className="mt-4 text-xs text-muted-foreground sm:text-sm">
          🎯 {needsCount} {needsCount === 1 ? "need" : "needs"} awaiting support
        </p>
      )}
    </section>
  );
};
