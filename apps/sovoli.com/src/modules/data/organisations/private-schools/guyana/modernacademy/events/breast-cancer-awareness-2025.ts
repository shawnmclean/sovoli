import type { Event } from "~/modules/events/types";

export const BREAST_CANCER_AWARENESS_2025_EVENT: Event = {
  id: "breast-cancer-awareness-2025",
  slug: "breast-cancer-awareness-2025",
  name: "Breast Cancer Awareness Day",
  description:
    "A day dedicated to raising awareness about breast cancer and supporting those affected through pink-themed activities and reflections.",
  tagline: "🎀 Wear Pink for Awareness - October 24th",
  startDate: "2025-10-24",
  startTime: "08:30",
  endTime: "14:30",
  location: "Modern Academy Main Campus",
  status: "upcoming",
  category: {
    id: "health-and-wellness",
    name: "Health & Wellness",
    description: "Events promoting health education and community support",
    color: "#EC4899",
  },
  tags: ["health", "awareness", "pink", "october"],
  highlights: [
    {
      icon: "calendar",
      label: "Pink Out Day",
      description: "Students wear pink T-shirts with jeans to show solidarity.",
    },
    {
      icon: "heart",
      label: "Support & Compassion",
      description: "Honouring survivors and encouraging supportive conversations.",
    },
    {
      icon: "users",
      label: "Class Activities",
      description: "Age-appropriate discussions and creative awareness projects.",
    },
  ],
  activities: [
    {
      id: "awareness-assembly",
      title: "Morning Awareness Assembly",
      description: "A short assembly highlighting the importance of early detection and support.",
      duration: "30 minutes",
    },
    {
      id: "pink-ribbon-craft",
      title: "Pink Ribbon Crafts",
      description: "Students create ribbons, posters, or cards to promote awareness.",
      duration: "45 minutes",
      materials: ["Pink paper", "Markers", "Scissors", "Ribbon"],
    },
  ],
  requirements: [
    {
      id: "pink-shirt",
      name: "Pink T-Shirt",
      description: "Students should wear a pink T-shirt paired with black or blue jeans.",
      type: "wear",
      isRequired: true,
    },
    {
      id: "balloons",
      name: "Pink or White Balloons",
      description: "Each student is asked to bring pink or white balloons for the awareness display.",
      type: "bring",
      isRequired: true,
      quantity: "1-2 per student",
    },
  ],
  notes:
    "Teachers will facilitate age-appropriate conversations about health, self-care, and supporting families affected by breast cancer.",
};
