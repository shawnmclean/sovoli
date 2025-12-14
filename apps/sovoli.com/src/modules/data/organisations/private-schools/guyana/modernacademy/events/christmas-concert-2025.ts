import type { Event } from "~/modules/events/types";
import { Media } from "~/modules/core/media/types";

const CHRISTMAS_CONCERT_EVENT_PHOTOS: Media[] = [
  {
    type: "image",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1760992018/o/magy/events/christmas-concert-2025/1.png",
    assetId: "75c4870e93b221ea44c04ca5c1d8523d",
    publicId: "o/magy/events/christmas-concert-2025/1",
    width: 1024,
    height: 1024,
    format: "png",
    bytes: 2068117,
    version: 1760992018,
    uploadedAt: "2025-10-20T20:26:58Z",
  },
];

export const CHRISTMAS_CONCERT_2025_EVENT: Event = {
  id: "christmas-concert-2025",
  slug: "christmas-concert-2025",
  name: "Christmas Concert",
  description:
    "A festive showcase featuring student performances, carols, and holiday cheer for the whole school community.",
  tagline: "🎄 Holiday Performances - December 12th",
  startDate: "2025-12-12",
  startTime: "17:00",
  endTime: "19:00",
  location: "Modern Academy Auditorium",
  status: "upcoming",
  category: {
    id: "performing-arts",
    name: "Performing Arts",
    description: "Music, drama, and performance-based events",
    color: "#22C55E",
  },
  tags: ["concert", "holiday", "december", "performances"],
  highlights: [
    {
      icon: "music",
      label: "Student Performances",
      description:
        "Choirs, skits, and instrumental pieces celebrating the season.",
    },
    {
      icon: "users",
      label: "Family Gathering",
      description:
        "Parents and guardians are invited to enjoy the evening showcase.",
    },
    {
      icon: "gift",
      label: "Festive Atmosphere",
      description:
        "Decorated stage, holiday backdrops, and photo opportunities.",
    },
  ],
  activities: [
    {
      id: "dress-rehearsal",
      title: "Dress Rehearsal",
      description:
        "Final rehearsal during school hours to prepare for the evening performance.",
      duration: "2 hours",
    },
    {
      id: "evening-concert",
      title: "Evening Concert",
      description:
        "Live performances from each grade level highlighting holiday traditions.",
      duration: "2 hours",
    },
  ],
  requirements: [
    {
      id: "festive-attire",
      name: "Festive Attire",
      description:
        "Students should wear coordinated holiday outfits or performance costumes as directed by teachers.",
      type: "wear",
      isRequired: true,
    },
    {
      id: "arrival-time",
      name: "Early Arrival",
      description:
        "Performers should arrive 30 minutes early to check in with their class.",
      type: "prepare",
      isRequired: true,
    },
  ],
  media: CHRISTMAS_CONCERT_EVENT_PHOTOS,
  notes:
    "Limited seating is available; families are encouraged to RSVP. Light refreshments will be available after the show.",
};
