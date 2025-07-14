import type {
  AcademicModule,
  OrgProgram,
  OrgProgramCycle,
  ProgramLevel,
} from "~/modules/academics/types";

const FITRIGHT_BEGINNER_LEVEL: ProgramLevel = {
  id: "fr-beginner-level",
  order: 0,
  label: "Beginner",
  type: "level",
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
};

const FITRIGHT_BAG_WORKSHOP_PROGRAM: OrgProgram = {
  name: "Intro to Sewing: Make Your Own Bag",
  slug: "sew-your-own-bag",
  description:
    "A hands-on introduction to sewing for complete beginners. In just one day, you'll learn how to measure, cut, and stitch fabric — and leave with your very own handmade bag.",
  photos: [
    {
      category: "default",
      url: "/orgs/vocational-training/guyana/fitright/photos/1.webp",
    },
  ],
  levels: [FITRIGHT_BEGINNER_LEVEL],
};

// Helper function to create a cycle with a specific date
const createFitrightCycle = (day: number): OrgProgramCycle => ({
  id: `fr-cycle-july${day}`,
  orgProgram: FITRIGHT_BAG_WORKSHOP_PROGRAM,
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
        label: "Tuition",
        purpose: "tuition",
        billingCycle: "one-time",
        amount: { GYD: 8000 },
      },
    ],
  },
  computedRequirements: [],
});

// Create cycles for July 25th, 26th, and 27th
const FITRIGHT_BAG_WORKSHOP_CYCLE_JULY25 = createFitrightCycle(25);
const FITRIGHT_BAG_WORKSHOP_CYCLE_JULY26 = createFitrightCycle(26);
const FITRIGHT_BAG_WORKSHOP_CYCLE_JULY27 = createFitrightCycle(27);

export const FITRIGHT_ACADEMIC: AcademicModule = {
  programs: [FITRIGHT_BAG_WORKSHOP_PROGRAM],
  programCycles: [
    FITRIGHT_BAG_WORKSHOP_CYCLE_JULY25,
    FITRIGHT_BAG_WORKSHOP_CYCLE_JULY26,
    FITRIGHT_BAG_WORKSHOP_CYCLE_JULY27,
  ],
};
