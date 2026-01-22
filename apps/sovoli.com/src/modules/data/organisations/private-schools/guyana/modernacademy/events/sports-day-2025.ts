import type { Media } from "~/modules/core/media/types";
import type { Event } from "~/modules/events/types";

const SPORTS_DAY_EVENT_PHOTOS: Media[] = [
  {
    type: "image",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1760991745/o/magy/events/sports-day-2025/1.png",
    assetId: "b710400ee729f8aec3563984ba304e12",
    publicId: "o/magy/events/sports-day-2025/1",
    width: 1024,
    height: 1024,
    format: "png",
    bytes: 2187568,
    version: 1760991745,
    uploadedAt: "2025-10-20T20:22:25Z",
  },
];

export const SPORTS_DAY_2025_EVENT: Event = {
  id: "sports-day-2025",
  slug: "sports-day-2025",
  name: "Sports Day",
  description:
    "An energetic day of friendly competition featuring team-based athletic events across the house colours.",
  tagline: "🏅 Team Spirit & Athletics - November 7th",
  startDate: "2025-11-07",
  startTime: "08:30",
  endTime: "15:00",
  location: "Modern Academy Sports Field",
  status: "upcoming",
  category: {
    id: "sports-and-fitness",
    name: "Sports & Fitness",
    description: "Athletic events promoting health, teamwork, and endurance",
    color: "#10B981",
  },
  tags: ["sports", "competition", "teams", "november"],
  highlights: [
    {
      icon: "trophy",
      label: "House Competitions",
      description:
        "Each team represents their colour in track and field challenges.",
    },
    {
      icon: "users",
      label: "Team Spirit",
      description: "Students cheer on classmates and build camaraderie.",
    },
    {
      icon: "heart",
      label: "Healthy Fun",
      description: "Encourages physical activity and wellness for all ages.",
    },
  ],
  activities: [
    {
      id: "opening-ceremony",
      title: "Opening Ceremony & Warm-Up",
      description:
        "House teams gather for introductions, chants, and stretching routines.",
      duration: "45 minutes",
    },
    {
      id: "relay-races",
      title: "Relay Races & Field Events",
      description:
        "Track races, relays, and fun obstacle courses for each age group.",
      duration: "3 hours",
    },
  ],
  requirements: [
    {
      id: "team-colors",
      name: "Team Colour Outfit",
      description:
        "Students should wear their team's colour to represent their house.",
      type: "wear",
      isRequired: true,
    },
    {
      id: "water-bottle",
      name: "Water Bottle",
      description:
        "Bring a labelled water bottle to stay hydrated throughout the day.",
      type: "bring",
      isRequired: true,
    },
    {
      id: "sunscreen",
      name: "Sun Protection",
      description:
        "Apply sunscreen and wear hats or visors for outdoor comfort.",
      type: "prepare",
      isRequired: false,
    },
  ],
  media: SPORTS_DAY_EVENT_PHOTOS,
  notes:
    "Parents and guardians are invited to cheer for teams and ensure students have a healthy snack for the day.",
};
