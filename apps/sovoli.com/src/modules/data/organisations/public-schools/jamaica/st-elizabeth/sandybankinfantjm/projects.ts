import type { ProjectsModule } from "~/modules/projects/types";
import { SANDY_BANK_INFANT_SCHOOL_NEEDS } from "./needs";

function findNeedBySlug(slug: string) {
  const need = SANDY_BANK_INFANT_SCHOOL_NEEDS.needs.find(
    (entry) => entry.slug === slug,
  );

  if (!need) {
    throw new Error(
      `${slug} need is missing from Sandy Bank Infant School needs configuration.`,
    );
  }

  return need;
}

export const SANDY_BANK_INFANT_SCHOOL_PROJECTS: ProjectsModule = {
  projects: [
    {
      id: "sandybankinfant-hurricane-roof-repair-2025",
      title: "Hurricane Relief Roof Repair",
      description:
        "Replace the hurricane-damaged roof and secure entrances to restore safe learning spaces.",
      category: "relief",
      status: "planned",
      priority: "high",
      locationKey: "main-campus",
      internal: false,
      needs: [
        findNeedBySlug("sandybankinfant-industrial-sheeting-2025"),
        findNeedBySlug("sandybankinfant-exterior-door-2025"),
      ],
      notes: "Assessment notes: Entire roof damaged during the hurricane event.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};
