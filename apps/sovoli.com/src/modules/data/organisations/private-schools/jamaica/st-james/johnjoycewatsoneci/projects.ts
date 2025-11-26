import type { ProjectsModule } from "~/modules/projects/types";
import { JOHN_JOYCE_WATSON_ECI_NEEDS } from "./needs";

function findNeedBySlug(slug: string) {
  const need = JOHN_JOYCE_WATSON_ECI_NEEDS.needs.find(
    (entry) => entry.slug === slug,
  );

  if (!need) {
    throw new Error(
      `${slug} need is missing from John Joyce Watson Watson ECI needs configuration.`,
    );
  }

  return need;
}

export const JOHN_JOYCE_WATSON_ECI_PROJECTS: ProjectsModule = {
  projects: [
    {
      id: "facility-restoration-2025",
      title: "Facility Restoration and Equipment Recovery",
      description:
        "Comprehensive restoration project to repair storm damage to doors, furniture, and replace damaged equipment and educational materials.",
      category: "relief",
      status: "planned",
      priority: "high",
      locationKey: "main-campus",
      internal: false,
      needs: [findNeedBySlug("johnjoycewatsoneci-plyboard-sheet-2025")],
      media: [
        {
          type: "image",
          category: "environment",
          url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1763734675/o/john-joyce-watson-watson-eci/projects/p52yby4soobgval76qjzz0g6.webp",
          publicId:
            "o/john-joyce-watson-watson-eci/projects/p52yby4soobgval76qjzz0g6",
          assetId: "05d6cc8a8098d77585ea0075d58dde81",
          width: 1600,
          height: 900,
          format: "webp",
          bytes: 184612,
          version: 1763734675,
          uploadedAt: "2025-11-21T14:17:55Z",
          caption: "Storm damage assessment at John Joyce Watson Watson ECI",
          alt: "Facility damage showing areas requiring repair and restoration",
        },
        {
          type: "image",
          category: "environment",
          url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1763734675/o/john-joyce-watson-watson-eci/projects/egntexd0w0ill9gvrqikvgp3.webp",
          publicId:
            "o/john-joyce-watson-watson-eci/projects/egntexd0w0ill9gvrqikvgp3",
          assetId: "d48765698ecfa06491da8b25e3c71da5",
          width: 1600,
          height: 900,
          format: "webp",
          bytes: 117618,
          version: 1763734675,
          uploadedAt: "2025-11-21T14:17:55Z",
          caption:
            "Interior damage showing furniture and equipment destruction",
          alt: "Interior view of damaged classroom and equipment at John Joyce Watson Watson ECI",
        },
        {
          type: "image",
          category: "environment",
          url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1763734675/o/john-joyce-watson-watson-eci/projects/hniutjf12n6ip2s1k3u8p8kq.webp",
          publicId:
            "o/john-joyce-watson-watson-eci/projects/hniutjf12n6ip2s1k3u8p8kq",
          assetId: "7c63c5d94d60e04b733d263765c4a5f7",
          width: 900,
          height: 1600,
          format: "webp",
          bytes: 263008,
          version: 1763734675,
          uploadedAt: "2025-11-21T14:17:55Z",
          caption:
            "Detailed view of structural and equipment damage requiring immediate attention",
          alt: "Close-up view of damaged doors and structural elements at John Joyce Watson Watson ECI",
        },
        {
          type: "image",
          category: "environment",
          url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1763734675/o/john-joyce-watson-watson-eci/projects/a30n98kcqyo1nr5fpbjbnheq.webp",
          publicId:
            "o/john-joyce-watson-watson-eci/projects/a30n98kcqyo1nr5fpbjbnheq",
          assetId: "52d5e81e6a4c64c35ef4a25b9aa745ba",
          width: 1600,
          height: 900,
          format: "webp",
          bytes: 146050,
          version: 1763734675,
          uploadedAt: "2025-11-21T14:17:55Z",
          caption: "Overview of facility conditions and repair requirements",
          alt: "General facility view showing extent of damage at John Joyce Watson Watson ECI",
        },
        {
          type: "image",
          category: "environment",
          url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1763734676/o/john-joyce-watson-watson-eci/projects/keosu5sl3fx48bh7lp315z96.webp",
          publicId:
            "o/john-joyce-watson-watson-eci/projects/keosu5sl3fx48bh7lp315z96",
          assetId: "eed9f927c334ba8efb0005fff3dcd988",
          width: 900,
          height: 1600,
          format: "webp",
          bytes: 266978,
          version: 1763734676,
          uploadedAt: "2025-11-21T14:17:56Z",
          caption:
            "Additional documentation of damage to educational materials and equipment",
          alt: "Educational materials and equipment damage at John Joyce Watson Watson ECI",
        },
      ],
      notes:
        "Assessment notes: Door, furniture destroyed, fridge, microwave, blender, television, security cameras, teaching aids and children books and toys damaged. Comprehensive restoration required for full operational capacity.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};
