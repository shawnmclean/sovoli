import type { ProgramGroup, ProgramHighlight } from "~/modules/academics/types";

export const sewingClassProgramHighlights: ProgramHighlight[] = [
  {
    icon: "hammer",
    label: "Hands-On Learning",
    description:
      "Use real tools and materials from day one to practice sewing techniques.",
  },
  {
    icon: "users",
    label: "Small Group",
    description:
      "Personal attention and relaxed pace in a small class environment.",
  },
];

export const bagWorkshopHighlights: ProgramHighlight[] = [
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
];

export const FITRIGHT_SEWING_PROGRAM_GROUP: ProgramGroup = {
  id: "sewing",
  slug: "sewing",
  name: "Sewing",
  description: "Elementary to Advanced Sewing Programs",
};
