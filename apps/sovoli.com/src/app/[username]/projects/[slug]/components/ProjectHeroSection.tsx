import type { Project } from "~/modules/projects/types";
import type { OrgInstance } from "~/modules/organisations/types";
import type { OrgLocation } from "~/modules/organisations/types";
import { formatTimeline } from "~/app/(temp)/projects/lib/formatters";

export interface ProjectHeroSectionProps {
  orgInstance: OrgInstance;
  project: Project;
  location?: OrgLocation;
}

export const ProjectHeroSection = ({ project }: ProjectHeroSectionProps) => {
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

  return (
    <section className="mb-2 border-b border-default-200 pb-2 text-center sm:mb-8 sm:pb-8">
      {/* Project Title */}
      <h1 className="my-4 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
        {project.title}
      </h1>

      {/* Timeline */}
      {timeline && (
        <p className="mx-auto mt-2 max-w-3xl text-xs text-foreground-500 sm:text-sm">
          {timeline}
        </p>
      )}
    </section>
  );
};
