import type { Project } from "~/modules/projects/types";
import type { OrgInstance } from "~/modules/organisations/types";
import type { OrgLocation } from "~/modules/organisations/types";

export interface ProjectHeroSectionProps {
  orgInstance: OrgInstance;
  project: Project;
  location?: OrgLocation;
}

export const ProjectHeroSection = ({ project }: ProjectHeroSectionProps) => {
  return (
    <section className="my-4 py-2 text-center">
      <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
        {project.title}
      </h1>
    </section>
  );
};
