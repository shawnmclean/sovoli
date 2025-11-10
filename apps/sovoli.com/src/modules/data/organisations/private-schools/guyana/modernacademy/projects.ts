import type { ProjectsModule } from "~/modules/projects/types";
import { MODERN_ACADEMY_NEEDS } from "./needs";

function findNeedBySlug(slug: string) {
  const need = MODERN_ACADEMY_NEEDS.needs.find((entry) => entry.slug === slug);

  if (!need) {
    throw new Error(
      `${slug} need is missing from Modern Academy needs configuration.`,
    );
  }

  return need;
}

export const MODERN_ACADEMY_PROJECTS: ProjectsModule = {
  projects: [
    {
      id: "magy-classroom-ac-2025",
      title: "Classroom Air Conditioning Units",
      description:
        "Install new air conditioning units to keep the main campus classrooms cool before the new school year.",
      category: "maintenance",
      status: "planned",
      priority: "high",
      locationKey: "main-campus",
      startDate: "2025-08-15",
      endDate: "2025-08-31",
      internal: false,
      needs: [findNeedBySlug("magy-classroom-ac-2025")],
    },
  ],
};
