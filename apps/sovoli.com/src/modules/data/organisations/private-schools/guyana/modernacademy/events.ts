import type { EventModule } from "~/modules/events/types";
import { DIWALI_EVENT_PHOTOS } from "./photos";

export const MODERN_ACADEMY_EVENTS: EventModule = {
  events: [
    {
      id: "diwali-2025",
      slug: "diwali-2025",
      name: "Diwali Celebration",
      description:
        "Join us for a vibrant Diwali celebration with traditional activities, rangoli making, and cultural learning experiences.",
      tagline: "🪔 Festival of Lights - October 17th",
      startDate: "2025-10-17",
      startTime: "09:00",
      endTime: "15:00",
      location: "Modern Academy Main Campus",
      status: "upcoming",
      isPopular: true,
      category: {
        id: "cultural-celebration",
        name: "Cultural Celebration",
        description: "Traditional cultural events and festivals",
        color: "#FF6B35",
      },
      tags: ["cultural", "festival", "traditional", "celebration", "october"],
      highlights: [
        {
          icon: "calendar",
          label: "Date & Time",
          description: "October 17th, 2025 from 9:00 AM to 3:00 PM",
        },
        {
          icon: "palette",
          label: "Rangoli Making",
          description:
            "Creative rangoli designs and traditional art activities",
        },
        {
          icon: "users",
          label: "Class Activities",
          description:
            "Interactive learning about Diwali traditions and culture",
        },
        {
          icon: "gift",
          label: "Sweet Treats",
          description: "Traditional Indian sweets and festive treats",
        },
        {
          icon: "heart",
          label: "Community Spirit",
          description: "Building cultural understanding and community bonds",
        },
      ],
      photos: DIWALI_EVENT_PHOTOS,
      activities: [
        {
          id: "rangoli-making",
          title: "Rangoli Making Workshop",
          description:
            "Learn the art of traditional Indian rangoli patterns using colored rice and natural materials.",
          duration: "1 hour",
          materials: [
            "1 pint of rice per child",
            "Food coloring (red, yellow, green, blue)",
            "Sweet meats (traditional Indian sweets)",
            "Paper plates for mixing colors",
            "Small brushes or fingers for application",
          ],
          instructions: [
            "Mix rice with different food colors to create vibrant colored rice",
            "Learn basic rangoli patterns and designs",
            "Create individual rangoli artwork",
            "Display finished rangoli in the classroom",
          ],
        },
        {
          id: "diwali-storytelling",
          title: "Diwali Storytelling Session",
          description:
            "Listen to traditional Diwali stories and learn about the festival's significance.",
          duration: "30 minutes",
          materials: ["Story books about Diwali", "Visual aids and pictures"],
          instructions: [
            "Gather in a circle for storytelling",
            "Listen to the story of Rama and Sita",
            "Discuss the meaning of light over darkness",
            "Share what Diwali means to different families",
          ],
        },
        {
          id: "traditional-dress",
          title: "Traditional Dress Day",
          description:
            "Wear traditional Indian clothing or Friday wear if traditional clothes are not available.",
          duration: "All day",
          materials: [
            "Traditional Indian wear (optional)",
            "Friday casual wear",
          ],
          instructions: [
            "Students can wear traditional Indian clothing",
            "If traditional wear is not available, Friday casual wear is acceptable",
            "Teachers will wear traditional Indian attire",
            "Take photos to celebrate the cultural diversity",
          ],
        },
      ],
      requirements: [
        {
          id: "rice-requirement",
          name: "1 Pint of Rice",
          description:
            "Each child should bring 1 pint of rice for rangoli making activities",
          type: "bring",
          isRequired: true,
          quantity: "1 pint per child",
          notes: "Any type of rice is acceptable - white, brown, or basmati",
        },
        {
          id: "food-coloring",
          name: "Food Coloring",
          description: "Food coloring for creating colored rice for rangoli",
          type: "bring",
          isRequired: true,
          quantity: "1 set per child",
          notes:
            "Basic colors: red, yellow, green, blue. Can be liquid or gel food coloring",
        },
        {
          id: "sweet-meats",
          name: "Sweet Meats",
          description:
            "Traditional Indian sweets to share during the celebration",
          type: "bring",
          isRequired: true,
          quantity: "1 small container per child",
          notes:
            "Traditional Indian sweets like ladoo, barfi, or any festive treats",
        },
        {
          id: "traditional-dress",
          name: "Traditional Indian Wear",
          description: "Traditional Indian clothing for the celebration",
          type: "wear",
          isRequired: false,
          notes:
            "Optional - Friday casual wear is acceptable if traditional wear is not available",
        },
      ],
      notes:
        "This is a special cultural celebration event. Parents are encouraged to participate and share their own Diwali traditions. The event promotes cultural diversity and understanding among all students.",
    },
  ],
  upcomingEvents: [],
  featuredEvents: [],
};
