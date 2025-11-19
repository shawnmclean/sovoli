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

  return (
    <section className="mb-4 border-b border-default-200 pb-6 text-center">
      {/* Project Title */}
      <h1 className="text-2xl leading-tight tracking-tight my-4">
        {project.title}
      </h1>

      {/* Quick Facts */}
      {quickFacts.length > 0 && (
        <p className="text-sm text-foreground-500 max-w-3xl mx-auto">
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
        <p className="text-sm text-foreground-500 mt-2 max-w-3xl mx-auto">
          {timeline}
        </p>
      )}

      {/* Location */}
      {displayLocation && (
        <div className="flex justify-center gap-2 text-foreground-500 mt-2">
          <span className="text-sm">
            {displayLocation.label ?? `${displayLocation.address.city ?? ""}`}
            {displayLocation.address.city &&
              displayLocation.address.countryCode &&
              ", "}
            {displayLocation.address.countryCode &&
              countryCodeToName(displayLocation.address.countryCode)}
          </span>
        </div>
      )}

      {/* Trust/Support Badge */}
      {needsCount > 0 && (
        <p className="text-sm text-muted-foreground mt-4">
          🎯 {needsCount} {needsCount === 1 ? "need" : "needs"} awaiting support
        </p>
      )}
    </section>
  );
};
