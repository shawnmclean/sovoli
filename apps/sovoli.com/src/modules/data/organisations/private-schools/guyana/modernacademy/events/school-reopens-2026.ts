import type { Event } from "~/modules/events/types";

export const SCHOOL_REOPENS_2026_EVENT: Event = {
  id: "school-reopens-2026",
  slug: "school-reopens-2026",
  name: "School Reopens",
  description:
    "Welcome back to a new term as students return to campus for the January start of classes.",
  tagline: "📅 New Term Begins - January 5th",
  startDate: "2026-01-05",
  startTime: "08:30",
  endTime: "15:00",
  location: "Modern Academy Main Campus",
  status: "upcoming",
  category: {
    id: "school-operations",
    name: "School Operations",
    description: "Administrative and calendar notices",
    color: "#0EA5E9",
  },
  tags: ["return", "january", "new-term"],
  highlights: [
    {
      icon: "calendar",
      label: "Term Commencement",
      description: "Classes resume for the January term on Monday, January 5th, 2026.",
    },
    {
      icon: "users",
      label: "Orientation Touchpoints",
      description: "Teachers review expectations, schedules, and upcoming learning goals.",
    },
    {
      icon: "book-open",
      label: "Ready to Learn",
      description: "Students receive new timetables, books, and assignments for the term ahead.",
    },
  ],
  activities: [
    {
      id: "welcome-assembly",
      title: "Welcome Back Assembly",
      description: "Principal's address and reminders about school values and routines.",
      duration: "30 minutes",
    },
  ],
  requirements: [
    {
      id: "uniform",
      name: "Full School Uniform",
      description: "Students should return in full uniform with appropriate footwear.",
      type: "wear",
      isRequired: true,
    },
    {
      id: "school-supplies",
      name: "Updated School Supplies",
      description: "Bring refreshed stationery, textbooks, and completed holiday assignments.",
      type: "bring",
      isRequired: true,
    },
  ],
  notes:
    "School offices reopen beforehand for any administrative queries. Please arrive early to settle into new classrooms.",
};
