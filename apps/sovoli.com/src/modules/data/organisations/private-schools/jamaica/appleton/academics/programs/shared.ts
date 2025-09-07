import type { Activity, ProgramHighlight } from "~/modules/academics/types";

export const APPLETON_NURSERY_DEPT_ACTIVITIES: Activity[] = [
  {
    id: "appleton-story-time",
    title: "Story Time",
  },
  {
    id: "appleton-art-craft",
    title: "Art & Craft",
  },
  {
    id: "appleton-outdoor-play",
    title: "Outdoor Play",
  },
  {
    id: "appleton-music-movement",
    title: "Music & Movement",
  },
];

export const nurseryProgramHighlights: ProgramHighlight[] = [
  {
    icon: "palette",
    label: "Play-Based Learning",
    description:
      "Learning through play and exploration in a nurturing environment",
  },
  {
    icon: "users",
    label: "Small Class Sizes",
    description: "Individual attention with small teacher-to-student ratios",
  },
  {
    icon: "book-open",
    label: "Holistic Development",
    description:
      "Focus on social, emotional, physical, and cognitive development",
  },
  {
    icon: "message-circle",
    label: "Parent Partnership",
    description:
      "Regular communication and involvement in your child's learning journey",
  },
];

export const appletonProgramQuickFacts: string[] = [
  "Ages: 3-5 years",
  "Class Size: Max 15 students",
  "School Hours: 8:00 AM - 2:00 PM",
  "Meals: Nutritious snacks provided",
];
