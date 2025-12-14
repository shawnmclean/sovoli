import type { Event } from "~/modules/events/types";
import type { Media } from "~/modules/core/media/types";

const AMERINDIAN_HERITAGE_DAY_EVENT_PHOTOS: Media[] = [
  {
    type: "image",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1760992329/o/magy/events/amerindian-heritage-day-2025/1.jpg",
    assetId: "5cb612fe5b7093a08db5cfa4f017fba3",
    publicId: "o/magy/events/amerindian-heritage-day-2025/1",
    width: 960,
    height: 1280,
    format: "jpg",
    bytes: 263744,
    version: 1760992329,
    uploadedAt: "2025-10-20T20:32:09Z",
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1760992330/o/magy/events/amerindian-heritage-day-2025/2.jpg",
    assetId: "7ac16f3e4a0a12d0e6f6de08adb443c8",
    publicId: "o/magy/events/amerindian-heritage-day-2025/2",
    width: 1153,
    height: 1280,
    format: "jpg",
    bytes: 263393,
    version: 1760992330,
    uploadedAt: "2025-10-20T20:32:10Z",
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1760992332/o/magy/events/amerindian-heritage-day-2025/3.jpg",
    assetId: "fa7577355a55f63452fcd41d49a9e2cb",
    publicId: "o/magy/events/amerindian-heritage-day-2025/3",
    width: 1280,
    height: 1268,
    format: "jpg",
    bytes: 284285,
    version: 1760992332,
    uploadedAt: "2025-10-20T20:32:12Z",
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1760992333/o/magy/events/amerindian-heritage-day-2025/4.jpg",
    assetId: "39c747a693b9dd1dcea032c27ceff482",
    publicId: "o/magy/events/amerindian-heritage-day-2025/4",
    width: 1220,
    height: 1280,
    format: "jpg",
    bytes: 263069,
    version: 1760992333,
    uploadedAt: "2025-10-20T20:32:13Z",
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1760992337/o/magy/events/amerindian-heritage-day-2025/5.jpg",
    assetId: "d877326fd4a2aa347ca4ca46229455a1",
    publicId: "o/magy/events/amerindian-heritage-day-2025/5",
    width: 1176,
    height: 1280,
    format: "jpg",
    bytes: 343910,
    version: 1760992337,
    uploadedAt: "2025-10-20T20:32:17Z",
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1760992339/o/magy/events/amerindian-heritage-day-2025/6.jpg",
    assetId: "79e5a6fbfd9e03e220c4df8509ac0c7d",
    publicId: "o/magy/events/amerindian-heritage-day-2025/6",
    width: 960,
    height: 1244,
    format: "jpg",
    bytes: 258748,
    version: 1760992339,
    uploadedAt: "2025-10-20T20:32:19Z",
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1760992340/o/magy/events/amerindian-heritage-day-2025/7.jpg",
    assetId: "19dd1c26738676ed76357169d71d8074",
    publicId: "o/magy/events/amerindian-heritage-day-2025/7",
    width: 1076,
    height: 1280,
    format: "jpg",
    bytes: 265955,
    version: 1760992340,
    uploadedAt: "2025-10-20T20:32:20Z",
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1760992342/o/magy/events/amerindian-heritage-day-2025/8.jpg",
    assetId: "7a8557f83f79fd25d06087214a7391d8",
    publicId: "o/magy/events/amerindian-heritage-day-2025/8",
    width: 1023,
    height: 1280,
    format: "jpg",
    bytes: 308234,
    version: 1760992342,
    uploadedAt: "2025-10-20T20:32:22Z",
  },
];

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
      description:
        "Students wear Amerindian outfits or Friday wear to show respect for Indigenous culture.",
    },
    {
      icon: "book-open",
      label: "Heritage Learning",
      description:
        "Classroom discussions and presentations about Guyana's First Peoples.",
    },
    {
      icon: "heart",
      label: "Community Respect",
      description:
        "Encourages appreciation and understanding of Indigenous communities.",
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
      description:
        "Create simple crafts inspired by Amerindian art and symbolism.",
      duration: "1 hour",
      materials: ["Colored paper", "Natural materials", "Glue", "Markers"],
    },
  ],
  requirements: [
    {
      id: "amerindian-outfit",
      name: "Amerindian Outfit",
      description:
        "Students are encouraged to wear traditional Amerindian attire.",
      type: "wear",
      isRequired: false,
      notes:
        "Friday wear is acceptable if an Amerindian outfit is not available.",
    },
  ],
  media: AMERINDIAN_HERITAGE_DAY_EVENT_PHOTOS,
  notes:
    "Families are welcome to share cultural artifacts, stories, or music to enrich the day's learning experiences.",
};
