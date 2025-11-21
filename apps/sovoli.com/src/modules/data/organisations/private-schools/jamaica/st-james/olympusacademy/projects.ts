import type { ProjectsModule } from "~/modules/projects/types";
import { OLYMPUS_ACADEMY_NEEDS } from "./needs";

function findNeedBySlug(slug: string) {
  const need = OLYMPUS_ACADEMY_NEEDS.needs.find((entry) => entry.slug === slug);

  if (!need) {
    throw new Error(
      `${slug} need is missing from Olympus Academy needs configuration.`,
    );
  }

  return need;
}

export const OLYMPUS_ACADEMY_PROJECTS: ProjectsModule = {
  projects: [
    {
      id: "comprehensive-reconstruction-2025",
      title: "Comprehensive School Reconstruction and Educational Restoration",
      description:
        "Major reconstruction project to rebuild completely destroyed roofs, restore electrical systems, and replace all educational materials after severe hurricane damage.",
      category: "relief",
      status: "planned",
      priority: "high",
      locationKey: "main-campus",
      internal: false,
      needs: [
        // Major construction materials
        findNeedBySlug("olympusacademy-industrial-roof-sheeting-2025"),
        findNeedBySlug("olympusacademy-zinc-ridge-cap-2025"),
        findNeedBySlug("olympusacademy-roof-sealant-2025"),
        findNeedBySlug("olympusacademy-roofing-screws-washers-2025"),
        findNeedBySlug("olympusacademy-roofing-screws-2025"),
        findNeedBySlug("olympusacademy-structural-screws-2025"),
        findNeedBySlug("olympusacademy-roofing-nails-2025"),
        findNeedBySlug("olympusacademy-hurricane-strap-nails-2025"),
        findNeedBySlug("olympusacademy-plyboard-sheet-2025"),
        findNeedBySlug("olympusacademy-lumber-2x2x12-2025"),
        findNeedBySlug("olympusacademy-lumber-2x6x12-2025"),
        findNeedBySlug("olympusacademy-lumber-2x4x12-2025"),
        findNeedBySlug("olympusacademy-plywood-3-4-4x8-2025"),
        findNeedBySlug("olympusacademy-exterior-door-2025"),
        // Tools
        findNeedBySlug("olympusacademy-impact-driver-2025"),
        findNeedBySlug("olympusacademy-tin-snips-2025"),
        // Educational supplies - Art and craft
        findNeedBySlug("olympusacademy-crayola-crayons-fat-2025"),
        findNeedBySlug("olympusacademy-crayola-crayons-fine-2025"),
        findNeedBySlug("olympusacademy-crayola-paint-2025"),
        findNeedBySlug("olympusacademy-glue-elmers-2025"),
        findNeedBySlug("olympusacademy-cardboard-lg-2025"),
        findNeedBySlug("olympusacademy-drafting-paper-2025"),
        findNeedBySlug("olympusacademy-drawing-book-2025"),
        findNeedBySlug("olympusacademy-building-blocks-2025"),
        findNeedBySlug("olympusacademy-crayola-play-dough-2025"),
        // Educational supplies - Stationery
        findNeedBySlug("olympusacademy-fat-pencil-2025"),
        findNeedBySlug("olympusacademy-pencils-pack-2025"),
        findNeedBySlug("olympusacademy-exercise-book-small-2025"),
        findNeedBySlug("olympusacademy-exercise-book-big-2025"),
        findNeedBySlug("olympusacademy-double-line-book-2025"),
      ],
      photos: [
        {
          category: "environment",
          url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1763740443/o/olympus-academy/projects/hom58z0vesneheam37uuwukm.webp",
          publicId: "o/olympus-academy/projects/hom58z0vesneheam37uuwukm",
          assetId: "c04200e8b8d778a57b7d836be0627902",
          width: 1280,
          height: 960,
          format: "webp",
          bytes: 130454,
          version: 1763740443,
          uploadedAt: "2025-11-21T15:54:03Z",
          caption:
            "Severe structural damage showing complete roof destruction at Olympus Academy",
          alt: "Complete roof destruction and structural damage at Olympus Academy requiring total reconstruction",
        },
        {
          category: "environment",
          url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1763740443/o/olympus-academy/projects/xe9nezxsiq0dgmqu7g5tsreb.webp",
          publicId: "o/olympus-academy/projects/xe9nezxsiq0dgmqu7g5tsreb",
          assetId: "7a92c360d1248626677f61df15828b69",
          width: 1280,
          height: 960,
          format: "webp",
          bytes: 108324,
          version: 1763740443,
          uploadedAt: "2025-11-21T15:54:03Z",
          caption:
            "Interior damage assessment showing destroyed teaching materials and ceiling",
          alt: "Interior view of classroom showing destroyed ceiling, teaching materials, and educational resources",
        },
        {
          category: "environment",
          url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1763740443/o/olympus-academy/projects/xdzbw9d2z0bf6jq9jkzrybrq.webp",
          publicId: "o/olympus-academy/projects/xdzbw9d2z0bf6jq9jkzrybrq",
          assetId: "3d6089a52cef8bc5578e5ba18adad184",
          width: 1280,
          height: 960,
          format: "webp",
          bytes: 175438,
          version: 1763740443,
          uploadedAt: "2025-11-21T15:54:03Z",
          caption:
            "Detailed view of structural damage requiring complete classroom rebuilding",
          alt: "Classroom structural damage showing need for total internal rebuilding and electrical rewiring",
        },
        {
          category: "environment",
          url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1763740444/o/olympus-academy/projects/xtq836emj3hbtcdw8n1y57gf.webp",
          publicId: "o/olympus-academy/projects/xtq836emj3hbtcdw8n1y57gf",
          assetId: "53ca0bab834b6d5bd0019940ff63befc",
          width: 1600,
          height: 1200,
          format: "webp",
          bytes: 329326,
          version: 1763740444,
          uploadedAt: "2025-11-21T15:54:04Z",
          caption:
            "Comprehensive damage documentation showing extent of reconstruction needed",
          alt: "Overall facility damage assessment at Olympus Academy showing severe destruction requiring major reconstruction",
        },
      ],
      notes:
        "Assessment notes: Roof of some buildings totally gone. Inside all teaching and learning resources destroyed. Electrical rewiring needed in four classrooms as both the roof and ceiling were ripped away. Two classrooms need total internal rebuilding. Sheetrock was totally destroyed in the ceiling and destroyed everything in the room. This is a severe damage case requiring comprehensive reconstruction and complete educational resource replacement.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};
