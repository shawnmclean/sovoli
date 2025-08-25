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

const FITRIGHT_ELEMENTARY_SEWING_PHOTOS: Photo[] = [
  {
    category: "default",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1756126211/o/fitright/programs/elementary-sewing/1.webp",
    assetId: "4d241cfd99248e1461f2a052c3e4c5ff",
    publicId: "o/fitright/programs/elementary-sewing/1",
    width: 4032,
    height: 3024,
    format: "webp",
    bytes: 631388,
    version: 1756126211,
  },
  {
    category: "default",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1756126221/o/fitright/programs/elementary-sewing/2.webp",
    assetId: "21780519efe80c5f7b78415a715b935d",
    publicId: "o/fitright/programs/elementary-sewing/2",
    width: 4032,
    height: 3024,
    format: "webp",
    bytes: 711670,
    version: 1756126221,
  },
  {
    category: "default",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1756126225/o/fitright/programs/elementary-sewing/3.webp",
    assetId: "1967b0ed2ccf9868120acdf27eb0a3c1",
    publicId: "o/fitright/programs/elementary-sewing/3",
    width: 4032,
    height: 3024,
    format: "webp",
    bytes: 719816,
    version: 1756126225,
  },
  {
    category: "default",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1756126234/o/fitright/programs/elementary-sewing/4.webp",
    assetId: "49dc8a4b01c2db1919c8cfe7611a77ea",
    publicId: "o/fitright/programs/elementary-sewing/4",
    width: 4032,
    height: 3024,
    format: "webp",
    bytes: 799872,
    version: 1756126234,
  },
  {
    category: "default",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1756126456/o/fitright/programs/elementary-sewing/5.webp",
    assetId: "b013b8b79de5d1e68b813dae030eb40b",
    publicId: "o/fitright/programs/elementary-sewing/5",
    width: 900,
    height: 1600,
    format: "webp",
    bytes: 69778,
    version: 1756126456,
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

export const ELEMENTARY_SEWING_PHOTOS: Photo[] = shuffleArray(
  FITRIGHT_ELEMENTARY_SEWING_PHOTOS,
);

export const INTEMEDIATE_SEWING_PHOTOS: Photo[] = shuffleArray(
  FITRIGHT_ELEMENTARY_SEWING_PHOTOS,
);

export const ADVANCED_SEWING_PHOTOS: Photo[] = shuffleArray(
  FITRIGHT_ELEMENTARY_SEWING_PHOTOS,
);
