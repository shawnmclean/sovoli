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
      photos: [
        {
          category: "environment",
          url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1763523979/o/sandybankinfantjm/projects/pq3yt5tipbzclezz0ylm.jpg",
          publicId: "o/sandybankinfantjm/projects/pq3yt5tipbzclezz0ylm",
          assetId: "75f6e0681411d934260a756291a2ad7b",
          width: 960,
          height: 1280,
          format: "jpg",
          bytes: 121368,
          version: 1763523979,
          uploadedAt: "2025-11-19T03:46:19Z",
          caption:
            "Roof damage at Sandy Bank Infant School after the hurricane.",
          alt: "Damaged Sandy Bank Infant School building showing roof damage",
        },
        {
          category: "environment",
          url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1763523980/o/sandybankinfantjm/projects/ssn9vsk8j7ad2ilei4ck.jpg",
          publicId: "o/sandybankinfantjm/projects/ssn9vsk8j7ad2ilei4ck",
          assetId: "1ee21a3df04ffca11e5fd708a1d3c639",
          width: 1280,
          height: 960,
          format: "jpg",
          bytes: 166892,
          version: 1763523980,
          uploadedAt: "2025-11-19T03:46:20Z",
          caption:
            "Assessment of structural damage and repair needs at Sandy Bank Infant School.",
          alt: "Structural assessment of damaged school facilities at Sandy Bank Infant",
        },
        {
          category: "environment",
          url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1763523981/o/sandybankinfantjm/projects/vv1dmo8hptrnc15vhtfz.jpg",
          publicId: "o/sandybankinfantjm/projects/vv1dmo8hptrnc15vhtfz",
          assetId: "1eab1910b493f5848308f9656e8e025b",
          width: 960,
          height: 1280,
          format: "jpg",
          bytes: 236051,
          version: 1763523981,
          uploadedAt: "2025-11-19T03:46:21Z",
          caption:
            "Detailed view of campus conditions requiring immediate attention.",
          alt: "Campus conditions showing areas needing immediate repair at Sandy Bank Infant School",
        },
      ],
      notes:
        "Assessment notes: Entire roof damaged during the hurricane event.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};
