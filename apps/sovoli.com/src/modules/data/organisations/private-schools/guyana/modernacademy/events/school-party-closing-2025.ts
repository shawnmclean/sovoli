import type { Event } from "~/modules/events/types";

export const SCHOOL_PARTY_CLOSING_2025_EVENT: Event = {
  id: "school-party-closing-2025",
  slug: "school-party-closing-2025",
  name: "School Party & Closing of School",
  description:
    "Celebrate the end of the school term with class parties, reflections, and a closing ceremony.",
  tagline: "🎉 Term Wrap-Up Celebration - December 18th",
  startDate: "2025-12-18",
  startTime: "09:00",
  endTime: "13:00",
  location: "Modern Academy Campus",
  status: "upcoming",
  category: {
    id: "community-celebration",
    name: "Community Celebration",
    description: "Whole-school gatherings and celebrations",
    color: "#F59E0B",
  },
  tags: ["celebration", "december", "party"],
  highlights: [
    {
      icon: "smile",
      label: "Class Parties",
      description: "Games, music, and treats within each classroom community.",
    },
    {
      icon: "users",
      label: "Whole-School Closing",
      description:
        "Final assembly to share announcements and celebrate achievements.",
    },
    {
      icon: "gift",
      label: "Student Appreciation",
      description: "Recognising effort and growth throughout the term.",
    },
  ],
  activities: [
    {
      id: "classroom-parties",
      title: "Classroom Parties",
      description:
        "Teachers facilitate themed games, music, and treat sharing.",
      duration: "2 hours",
    },
    {
      id: "closing-assembly",
      title: "Closing Assembly",
      description:
        "Principal's remarks, student recognitions, and farewell messages.",
      duration: "1 hour",
    },
  ],
  requirements: [
    {
      id: "snack-contribution",
      name: "Snack Contribution",
      description:
        "Students may bring a small snack or drink to share with classmates.",
      type: "bring",
      isRequired: false,
    },
  ],
  notes:
    "Students should take home all personal belongings. Report cards and holiday packets will be distributed during dismissal.",
};
