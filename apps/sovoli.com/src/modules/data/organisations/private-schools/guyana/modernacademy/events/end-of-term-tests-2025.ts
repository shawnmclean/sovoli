import type { Event } from "~/modules/events/types";
import type { Photo } from "~/modules/core/photos/types";

const END_OF_TERM_TESTS_EVENT_PHOTOS: Photo[] = [
  {
    category: "events",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1760991744/o/magy/events/end-of-term-tests-2025/1.png",
    assetId: "fbabf79579e117c3d13e75205ecbb5ef",
    publicId: "o/magy/events/end-of-term-tests-2025/1",
    width: 1024,
    height: 1024,
    format: "png",
    bytes: 2227227,
    version: 1760991744,
    uploadedAt: "2025-10-20T20:22:24Z",
  },
];

export const END_OF_TERM_TESTS_2025_EVENT: Event = {
  id: "end-of-term-tests-2025",
  slug: "end-of-term-tests-2025",
  name: "End-of-Term Tests",
  description:
    "Comprehensive assessments covering the term's learning objectives for all grades.",
  tagline: "📚 Assessment Week - December 1st to 10th",
  startDate: "2025-12-01",
  endDate: "2025-12-10",
  startTime: "08:30",
  endTime: "14:00",
  location: "Modern Academy Classrooms",
  status: "upcoming",
  category: {
    id: "academic-calendar",
    name: "Academic Calendar",
    description: "Assessments and academic milestones",
    color: "#3B82F6",
  },
  tags: ["assessments", "december", "academics"],
  highlights: [
    {
      icon: "calendar",
      label: "Multi-Day Testing",
      description:
        "Assessments run from December 1st through December 10th for all classes.",
    },
    {
      icon: "book-open",
      label: "Curriculum Review",
      description:
        "Evaluations cover literacy, numeracy, science, and thematic units.",
    },
    {
      icon: "message-circle",
      label: "Teacher Support",
      description:
        "Teachers provide guidance on study tips and revision plans.",
    },
  ],
  activities: [
    {
      id: "study-support",
      title: "Study Support Sessions",
      description:
        "Daily review blocks to help students prepare for each subject assessment.",
      duration: "45 minutes",
    },
  ],
  requirements: [
    {
      id: "exam-supplies",
      name: "Exam Supplies",
      description:
        "Bring sharpened pencils, erasers, rulers, and calculators where required.",
      type: "bring",
      isRequired: true,
    },
    {
      id: "rest",
      name: "Rest & Nutrition",
      description:
        "Ensure students get adequate rest and a healthy breakfast each morning.",
      type: "prepare",
      isRequired: false,
    },
  ],
  photos: END_OF_TERM_TESTS_EVENT_PHOTOS,
  notes:
    "Individual class timetables will be shared by teachers. Parents are encouraged to monitor homework platforms for revision guidance.",
};
