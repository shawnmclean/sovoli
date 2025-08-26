/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type {
  ProgramGroup,
  ProgramHighlight,
  RequirementList,
} from "~/modules/academics/types";
import { findItemById } from "~/modules/data/items";

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

export const fitrightProgramQuickFacts: string[] = [
  "Certificate Included",
  "Expert Instructor",
];

export const fitrightProgramRequirements: RequirementList[] = [
  {
    name: "You Would Need",
    category: "materials",
    audience: "student",
    items: [
      { item: findItemById("supply-seamstress-scissors")! },
      { item: findItemById("supply-sewing-pins")! },
      { item: findItemById("supply-pin-cushion")! },
      { item: findItemById("supply-tape-measure")! },
    ],
  },
  {
    name: "Rulers",
    category: "materials",
    audience: "student",
    items: [
      { item: findItemById("supply-straight-ruler")! },
      { item: findItemById("supply-french-curve")! },
      { item: findItemById("supply-tailors-chalk-blue")! },
      { item: findItemById("supply-tailors-chalk-red")! },
    ],
  },
  {
    name: "Universal",
    category: "materials",
    audience: "student",
    items: [
      { item: findItemById("supply-machine-needles-14")! },
      { item: findItemById("supply-hand-needle")! },
      { item: findItemById("supply-drafting-paper")! },
      { item: findItemById("supply-pencils")! },
      { item: findItemById("supply-erasers")! },
    ],
  },
];
