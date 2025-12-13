import type { ProgramGroup, ProgramHighlight } from "~/modules/academics/types";

export const wellnessProgramHighlights: ProgramHighlight[] = [
  {
    icon: "hammer",
    label: "Hands-On Learning",
    description:
      "Practice techniques on real clients from day one in a professional spa environment.",
  },
  {
    icon: "users",
    label: "Small Class Sizes",
    description:
      "Personal attention and individualized instruction in an intimate learning setting.",
  },
  {
    icon: "badge-check",
    label: "Certificate Included",
    description:
      "Receive a professional certificate upon successful completion of the program.",
  },
];

export const massageProgramHighlights: ProgramHighlight[] = [
  ...wellnessProgramHighlights,
  {
    icon: "graduation-cap",
    label: "Exam/Career Ready",
    description:
      "Graduate with the skills needed to work in spas, wellness centres, or start your own practice or take the exam to become a registered massage therapist.",
  },
];

export const HEALING_EMERALD_MASSAGE_PROGRAM_GROUP: ProgramGroup = {
  id: "massage-therapy",
  slug: "massage-therapy",
  name: "Massage Therapy",
  description: "Professional massage therapy training programs",
};

export const HEALING_EMERALD_WAXING_PROGRAM_GROUP: ProgramGroup = {
  id: "waxing",
  slug: "waxing",
  name: "Waxing",
  description: "Professional waxing and hair removal training",
};

export const healingEmeraldProgramQuickFacts: string[] = [
  "Certificate Included",
  "Expert Instructor",
  "Hands-On Training",
];
