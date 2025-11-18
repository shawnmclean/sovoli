import type { ProjectsModule } from "~/modules/projects/types";
import { APPLETON_BASIC_SCHOOL_NEEDS } from "./needs";

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
      needs: [],
      notes:
        "Project overseen by the principal with support from the parish disaster risk management team.",
      createdAt: "2025-09-20",
      updatedAt: "2025-09-22",
    },
  ],
};
