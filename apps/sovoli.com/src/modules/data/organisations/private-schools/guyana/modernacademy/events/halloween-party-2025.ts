import type { Event } from "~/modules/events/types";
import { Media } from "~/modules/core/media/types";

const HALLOWEEN_PARTY_EVENT_PHOTOS: Media[] = [
  {
    type: "image",
    category: "events",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1760991132/o/magy/events/halloween-party-2025/1.png",
    assetId: "9ecf6126c0bcfbdf5d2fcf49704b2374",
    publicId: "o/magy/events/halloween-party-2025/1",
    width: 1024,
    height: 1024,
    format: "png",
    bytes: 1868651,
    version: 1760991132,
    uploadedAt: "2025-10-20T20:12:12Z",
  },
];

export const HALLOWEEN_PARTY_2025_EVENT: Event = {
  id: "halloween-party-2025",
  slug: "halloween-party-2025",
  name: "Halloween Party",
  description:
    "A fun-filled Halloween celebration with costumes, class-to-class trick-or-treating, and themed decorations.",
  tagline: "🎃 Spooktacular Fun - October 31st",
  startDate: "2025-10-31",
  startTime: "12:30",
  endTime: "15:30",
  location: "Modern Academy Main Campus",
  status: "upcoming",
  category: {
    id: "seasonal-celebration",
    name: "Seasonal Celebration",
    description: "Holiday and seasonal events for the school community",
    color: "#F97316",
  },
  tags: ["halloween", "costumes", "treats", "october"],
  highlights: [
    {
      icon: "calendar",
      label: "Costume Parade",
      description:
        "Students dress up in creative costumes and showcase them with friends.",
    },
    {
      icon: "gift",
      label: "Trick-or-Treat",
      description: "Classes visit each other to exchange sweets and surprises.",
    },
    {
      icon: "smile",
      label: "Party Atmosphere",
      description: "Decorated classrooms with games, music, and themed snacks.",
    },
  ],
  activities: [
    {
      id: "costume-parade",
      title: "Costume Parade & Photos",
      description: "Students parade in their costumes and take group photos.",
      duration: "45 minutes",
    },
    {
      id: "trick-or-treat-route",
      title: "Classroom Trick-or-Treat Route",
      description: "Each class visits another to share treats and decorations.",
      duration: "1 hour",
    },
  ],
  requirements: [
    {
      id: "costume",
      name: "Halloween Costume",
      description:
        "Students should wear a costume of their choice and bring a treat basket.",
      type: "wear",
      isRequired: true,
      notes:
        "Costumes should be school-appropriate and comfortable for movement.",
    },
    {
      id: "treat-contribution",
      name: "Sweets or Chocolates",
      description:
        "Each child is asked to bring sweets or chocolates to share.",
      type: "bring",
      isRequired: true,
    },
    {
      id: "decorations",
      name: "Class Decorations",
      description:
        "Students can contribute Halloween decorations to brighten their classroom.",
      type: "bring",
      isRequired: false,
    },
  ],
  media: HALLOWEEN_PARTY_EVENT_PHOTOS,
  notes:
    "Teachers will supervise treat exchanges and ensure allergies or dietary needs are respected during the celebrations.",
};
