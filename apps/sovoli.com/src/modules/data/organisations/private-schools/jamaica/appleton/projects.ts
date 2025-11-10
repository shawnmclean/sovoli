import type { ProjectsModule } from "~/modules/projects/types";
import { APPLETON_BASIC_SCHOOL_NEEDS } from "./needs";

function findNeedBySlug(slug: string) {
  const need = APPLETON_BASIC_SCHOOL_NEEDS.needs.find(
    (entry) => entry.slug === slug,
  );

  if (!need) {
    throw new Error(
      `${slug} need is missing from Appleton Basic School needs configuration.`,
    );
  }

  return need;
}

export const APPLETON_BASIC_SCHOOL_PROJECTS: ProjectsModule = {
  projects: [
    {
      id: "absjm-hurricane-recovery-2025",
      title: "Hurricane Recovery and Campus Stabilization",
      description:
        "Coordinate emergency repairs, temporary shelter, and volunteer support to safely reopen Appleton Basic School after the hurricane.",
      category: "relief",
      status: "planned",
      priority: "high",
      locationKey: "main-campus",
      startDate: "2025-09-20",
      endDate: "2025-12-15",
      internal: false,
      needs: [
        findNeedBySlug("absjm-roof-repairs-2025"),
        findNeedBySlug("absjm-tarpaulin-cover-2025"),
        findNeedBySlug("absjm-cleanup-kits-2025"),
        findNeedBySlug("absjm-portable-generator-2025"),
        findNeedBySlug("absjm-skilled-volunteers-2025"),
        findNeedBySlug("absjm-debris-removal-crew-2025"),
      ],
      notes:
        "Project overseen by the principal with support from the parish disaster risk management team.",
      createdAt: "2025-09-20",
      updatedAt: "2025-09-22",
    },
  ],
};
