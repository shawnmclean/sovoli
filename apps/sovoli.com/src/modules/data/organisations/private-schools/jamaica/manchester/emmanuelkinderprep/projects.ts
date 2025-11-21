import type { ProjectsModule } from "~/modules/projects/types";
import { EMMANUEL_KINDER_PREP_NEEDS } from "./needs";

function findNeedBySlug(slug: string) {
  const need = EMMANUEL_KINDER_PREP_NEEDS.needs.find(
    (entry) => entry.slug === slug,
  );

  if (!need) {
    throw new Error(
      `${slug} need is missing from Emmanuel Kinder Prep needs configuration.`,
    );
  }

  return need;
}

export const EMMANUEL_KINDER_PREP_PROJECTS: ProjectsModule = {
  projects: [
    {
      id: "emmanuelkinderprep-hurricane-recovery-2025",
      title: "Hurricane Recovery and Educational Restoration",
      description:
        "Comprehensive recovery project to repair storm damage and restore educational materials for continued learning.",
      category: "relief",
      status: "planned",
      priority: "high",
      locationKey: "main",
      internal: false,
      needs: [
        // Construction and repair needs
        findNeedBySlug("emmanuelkinderprep-impact-driver-2025"),
        findNeedBySlug("emmanuelkinderprep-tin-snips-2025"),
        findNeedBySlug("emmanuelkinderprep-measuring-tape-2025"),
        findNeedBySlug("emmanuelkinderprep-roofing-hammer-2025"),
        findNeedBySlug("emmanuelkinderprep-roof-sealant-2025"),
        findNeedBySlug("emmanuelkinderprep-plyboard-sheet-2025"),
        findNeedBySlug("emmanuelkinderprep-roof-flashing-2025"),
        // Educational supplies
        findNeedBySlug("emmanuelkinderprep-crayola-crayons-2025"),
        findNeedBySlug("emmanuelkinderprep-pencils-pack-2025"),
        findNeedBySlug("emmanuelkinderprep-play-dough-2025"),
        findNeedBySlug("emmanuelkinderprep-building-blocks-2025"),
        findNeedBySlug("emmanuelkinderprep-exercise-book-big-2025"),
        findNeedBySlug("emmanuelkinderprep-double-line-book-2025"),
      ],
      photos: [],
      notes:
        "Assessment notes: Destruction of charts, damaged windows, wet furniture. School requires both structural repairs and replacement of educational materials to resume normal operations.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};
