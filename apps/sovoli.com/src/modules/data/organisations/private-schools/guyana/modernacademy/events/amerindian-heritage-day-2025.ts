import type { Event } from "~/modules/events/types";

export const AMERINDIAN_HERITAGE_DAY_2025_EVENT: Event = {
  id: "amerindian-heritage-day-2025",
  slug: "amerindian-heritage-day-2025",
  name: "Amerindian Heritage Day",
  description:
    "Celebrate Guyana's Indigenous cultures with traditional attire, storytelling, and classroom activities that honour Amerindian heritage.",
  tagline: "🇬🇾 Indigenous Pride - September 26th",
  startDate: "2025-09-26",
  startTime: "08:30",
  endTime: "14:30",
  location: "Modern Academy Main Campus",
  status: "upcoming",
  category: {
    id: "cultural-heritage",
    name: "Cultural Heritage",
    description: "Events celebrating Indigenous traditions and heritage",
    color: "#D97706",
  },
  tags: ["cultural", "heritage", "dress-up", "september"],
  highlights: [
    {
      icon: "calendar",
      label: "Dress in Heritage Wear",
      description: "Students wear Amerindian outfits or Friday wear to show respect for Indigenous culture.",
    },
    {
      icon: "book-open",
      label: "Heritage Learning",
      description: "Classroom discussions and presentations about Guyana's First Peoples.",
    },
    {
      icon: "heart",
      label: "Community Respect",
      description: "Encourages appreciation and understanding of Indigenous communities.",
    },
  ],
  activities: [
    {
      id: "heritage-presentations",
      title: "Heritage Presentations",
      description:
        "Teachers and students share stories, songs, and facts about Amerindian traditions and history.",
      duration: "45 minutes",
    },
    {
      id: "cultural-crafts",
      title: "Cultural Crafts Workshop",
      description: "Create simple crafts inspired by Amerindian art and symbolism.",
      duration: "1 hour",
      materials: ["Colored paper", "Natural materials", "Glue", "Markers"],
    },
  ],
  requirements: [
    {
      id: "amerindian-outfit",
      name: "Amerindian Outfit",
      description: "Students are encouraged to wear traditional Amerindian attire.",
      type: "wear",
      isRequired: false,
      notes: "Friday wear is acceptable if an Amerindian outfit is not available.",
    },
  ],
  notes:
    "Families are welcome to share cultural artifacts, stories, or music to enrich the day's learning experiences.",
};
