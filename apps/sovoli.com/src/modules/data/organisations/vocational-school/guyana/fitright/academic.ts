import type {
  AcademicModule,
  ProgramCycle,
  Program,
} from "~/modules/academics/types";
import { BAG_WORKSHOP_PHOTOS } from "./photos";

// Helper function to create a cycle with a specific date
const createFitrightCycle = (day: number, enrolled: number): ProgramCycle => ({
  id: `fr-cycle-july${day}`,
  academicCycle: {
    id: `fr-cycle-july${day}`,
    customLabel: `July ${day} - 10AM - 4PM`,
    startDate: `2025-07-${day.toString().padStart(2, "0")}`,
    endDate: `2025-07-${day.toString().padStart(2, "0")}`,
  },
  pricingPackage: {
    discounts: [],
    pricingItems: [
      {
        id: "tuition",
        label: "Materials",
        purpose: "materials",
        billingCycle: "one-time",
        amount: { GYD: 8000 },
      },
    ],
  },
  capacity: 6,
  enrolled,
});

const FITRIGHT_BAG_WORKSHOP_PROGRAM: Program = {
  id: "fr-bag-workshop",
  name: "Intro to Sewing: Make Your Own Bag",
  slug: "sew-your-own-bag",
  audience: "student",
  highlights: [
    {
      icon: "hammer",
      label: "Hands-On Learning",
      description:
        "Use real tools and materials from day one to practice sewing techniques.",
    },
    {
      icon: "shopping-bag",
      label: "Make & Take Bag",
      description:
        "Create your own tote bag during the workshop and take it home.",
    },
    {
      icon: "tool",
      label: "Tools Provided",
      description:
        "We provide sewing machines, scissors, and all fabric — just show up and sew.",
    },
    {
      icon: "users",
      label: "Small Group",
      description:
        "Personal attention and relaxed pace in a small class environment.",
    },
  ],
  description:
    "A hands-on introduction to sewing for complete beginners. In just one day, you'll learn how to measure, cut, and stitch fabric — and leave with your very own handmade bag.",
  photos: BAG_WORKSHOP_PHOTOS,
  courses: [
    {
      id: "fr-beginner-course-1",
      subject: { id: "fr-beginner-subject-1", name: "Sewing" },
      title: "Make Your Own Bag",
      description:
        "Learn to operate a sewing machine and complete your first project — a fully functional canvas tote bag. Designed for absolute beginners.",
      units: [
        {
          title: "Machine Control & Pattern Drafting",
          topics: [
            "Control sewing machine (speed, stitch length, pedal use)",
            "Draft pattern of the tote bag",
            "Select and cut correct fabric on grain",
            "Sew straight and curved lines on practice material",
          ],
        },
        {
          title: "Bag Construction & Finishing",
          topics: [
            "Sew a patch pocket on bag body",
            "Insert a zipper into bag opening",
            "Double fold hemming technique",
            "Finish raw fabric edges (zigzag or bias tape)",
            "Final assembly and completion of bag",
          ],
        },
      ],
    },
  ],
  cycles: [
    createFitrightCycle(25, 4),
    createFitrightCycle(26, 2),
    createFitrightCycle(27, 1),
  ],
};

export const FITRIGHT_ACADEMIC: AcademicModule = {
  programs: [FITRIGHT_BAG_WORKSHOP_PROGRAM],
};
