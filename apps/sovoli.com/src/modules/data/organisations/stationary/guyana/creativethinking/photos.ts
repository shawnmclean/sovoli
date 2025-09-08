import type { Photo } from "~/modules/core/photos/types";

const CREATIVE_THINKING_STATIONERY_HUB_PHOTOS: Photo[] = [
  {
    category: "default",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1753365788/o/ctshgy/store/1.webp",
    assetId: "placeholder-asset-id-1",
    publicId: "o/ctshgy/store/1",
    width: 1200,
    height: 800,
    format: "webp",
    bytes: 500000,
    version: 1753365788,
  },
  {
    category: "default",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1753365788/o/ctshgy/store/2.webp",
    assetId: "placeholder-asset-id-2",
    publicId: "o/ctshgy/store/2",
    width: 1200,
    height: 800,
    format: "webp",
    bytes: 450000,
    version: 1753365788,
  },
  {
    category: "default",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1753365788/o/ctshgy/store/3.webp",
    assetId: "placeholder-asset-id-3",
    publicId: "o/ctshgy/store/3",
    width: 1200,
    height: 800,
    format: "webp",
    bytes: 480000,
    version: 1753365788,
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

export const STORE_PHOTOS: Photo[] = shuffleArray(
  CREATIVE_THINKING_STATIONERY_HUB_PHOTOS,
);
