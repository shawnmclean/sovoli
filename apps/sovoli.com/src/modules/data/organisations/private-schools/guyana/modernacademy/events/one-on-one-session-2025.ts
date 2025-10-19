import type { Event } from "~/modules/events/types";

export const ONE_ON_ONE_SESSION_2025_EVENT: Event = {
  id: "one-on-one-session-2025",
  slug: "one-on-one-session-2025",
  name: "One-on-One Session",
  description:
    "Individual meetings between teachers and parents to discuss student progress before the holiday break.",
  tagline: "🗓️ Personalized Conferences - December 17th",
  startDate: "2025-12-17",
  startTime: "08:30",
  endTime: "12:00",
  location: "Modern Academy Classrooms",
  status: "upcoming",
  category: {
    id: "parent-engagement",
    name: "Parent Engagement",
    description: "Events that strengthen communication between home and school",
    color: "#8B5CF6",
  },
  tags: ["conferences", "parental-involvement", "december"],
  highlights: [
    {
      icon: "users",
      label: "Individual Meetings",
      description: "Dedicated time slots for tailored feedback and goal setting.",
    },
    {
      icon: "book-open",
      label: "Progress Reviews",
      description: "Teachers share assessment results and learning plans for next term.",
    },
    {
      icon: "heart",
      label: "Collaborative Support",
      description: "Opportunity for parents to share insights and partner with teachers.",
    },
  ],
  activities: [
    {
      id: "scheduled-conferences",
      title: "Scheduled Conferences",
      description: "Families attend pre-booked sessions lasting 15 minutes each.",
      duration: "15 minutes per family",
    },
  ],
  requirements: [
    {
      id: "appointment",
      name: "Book an Appointment",
      description: "Parents should confirm their meeting time with the class teacher in advance.",
      type: "prepare",
      isRequired: true,
    },
  ],
  notes:
    "Please arrive 5 minutes before your scheduled slot to ensure smooth transitions between meetings.",
};
