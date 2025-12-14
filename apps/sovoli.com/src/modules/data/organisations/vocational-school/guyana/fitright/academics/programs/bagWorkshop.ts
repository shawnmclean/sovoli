import type { Program } from "~/modules/academics/types";
import { BAG_WORKSHOP_PHOTOS } from "../../photos";
import { bagWorkshopHighlights } from "./shared";
import {
  FITRIGHT_BAG_WORKSHOP_JULY_25,
  FITRIGHT_BAG_WORKSHOP_JULY_26,
  FITRIGHT_BAG_WORKSHOP_JULY_27,
} from "../cycles";

export const FITRIGHT_BAG_WORKSHOP_PROGRAM: Program = {
  id: "fr-bag-workshop",
  name: "Intro to Sewing: Make Your Own Bag",
  slug: "sew-your-own-bag",
  audience: "student",
  highlights: bagWorkshopHighlights,
  description:
    "A hands-on introduction to sewing for complete beginners. In just one day, you'll learn how to measure, cut, and stitch fabric — and leave with your very own handmade bag.",
  media: { gallery: BAG_WORKSHOP_PHOTOS },
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
    FITRIGHT_BAG_WORKSHOP_JULY_25,
    FITRIGHT_BAG_WORKSHOP_JULY_26,
    FITRIGHT_BAG_WORKSHOP_JULY_27,
  ],
};
