import type { Photo } from "~/modules/core/photos/types";

const FITRIGHT_BAG_WORKSHOP_PHOTOS: Photo[] = [
  {
    category: "default",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1753365788/o/fitright/programs/sew-your-own-bag/6e1d3b6b-fbcc-4bb8-a001-3a8ed83bf65f.png",
    assetId: "a5c87c6eeee354d18c7e3123ab939318",
    publicId:
      "o/fitright/programs/sew-your-own-bag/6e1d3b6b-fbcc-4bb8-a001-3a8ed83bf65f",
    width: 2696,
    height: 2022,
    format: "png",
    bytes: 6099562,
    version: 1753365788,
  },
  {
    category: "default",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1753366479/o/fitright/programs/sew-your-own-bag/9c07fe65-4844-4c23-97c6-5891e8637816.png",
    assetId: "cefd22502ca0234f2b7b299766a2b78b",
    publicId:
      "o/fitright/programs/sew-your-own-bag/9c07fe65-4844-4c23-97c6-5891e8637816",
    width: 2696,
    height: 2022,
    format: "png",
    bytes: 6488663,
    version: 1753366479,
  },
];

// Fisher-Yates shuffle function
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    if (temp !== undefined && shuffled[j] !== undefined) {
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
  }
  return shuffled;
}

export const BAG_WORKSHOP_PHOTOS: Photo[] = shuffleArray(
  FITRIGHT_BAG_WORKSHOP_PHOTOS,
);
