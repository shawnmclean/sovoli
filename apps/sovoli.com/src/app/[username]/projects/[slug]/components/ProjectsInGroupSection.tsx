import type { Project, ProjectGroup } from "~/modules/projects/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { Link } from "@sovoli/ui/components/link";
import { slugify } from "~/utils/slugify";

export interface ProjectsInGroupSectionProps {
  orgInstance: OrgInstance;
  project?: Project;
  group: ProjectGroup;
}

export const ProjectsInGroupSection = ({
  orgInstance,
  project,
  group,
}: ProjectsInGroupSectionProps) => {
  if (!group.projects || group.projects.length === 0) {
    return null;
  }

  // If only one project in group and we're viewing that project, don't show
  if (group.projects.length <= 1 && project) {
    return null;
  }

  const projectsInGroup = group.projects;

  return (
    <section className="my-6 border-b border-default-200 pb-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            All projects in {group.name}
          </h2>
        </div>

        {/* Projects List */}
        <div className="space-y-2">
          {projectsInGroup.map((p, index) => {
            const projectSlug = slugify(p.title);
            const isCurrentProject = project && p.id === project.id;

            return (
              <div key={p.id} className="flex items-center gap-2">
                <span className="text-sm text-default-500 min-w-[20px]">
                  {index + 1}.
                </span>
                <Link
                  href={`/${orgInstance.org.username}/projects/${projectSlug}`}
                  color={isCurrentProject ? "primary" : "foreground"}
                  underline="hover"
                  className={isCurrentProject ? "font-medium" : ""}
                >
                  {p.title}
                  {isCurrentProject && " (this one)"}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

