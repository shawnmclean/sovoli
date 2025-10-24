import type { Photo } from "~/modules/core/photos/types";

const PHOTOS: Photo[] = [
  {
    category: "default",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1761265485/o/blcgy/school/park.jpg",
    assetId: "dee180ec9a3e44de60960b70b256dfe5",
    publicId: "o/blcgy/school/park",
    width: 590,
    height: 443,
    format: "jpg",
    bytes: 35536,
    version: 1761265485,
    uploadedAt: "2025-10-24T00:24:45Z",
  },
  {
    category: "events",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1761265484/o/blcgy/events/diwali-2025/diwali.jpg",
    assetId: "3f36df730a5efa0d0893da113e162bd4",
    publicId: "o/blcgy/events/diwali-2025/diwali",
    width: 526,
    height: 715,
    format: "jpg",
    bytes: 69033,
    version: 1761265484,
    uploadedAt: "2025-10-24T00:24:44Z",
  },
];

// Fisher-Yates shuffle function
export function shuffleArray<T>(array: T[]): T[] {
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

export const BACCHUS_LEARNING_PHOTOS: Photo[] = shuffleArray(PHOTOS);
export const NURSERY_YEAR_1_PHOTOS: Photo[] = shuffleArray(PHOTOS);
export const NURSERY_YEAR_2_PHOTOS: Photo[] = shuffleArray(PHOTOS);
export const PRIMARY_PHOTOS: Photo[] = shuffleArray(PHOTOS);
export const SECONDARY_PHOTOS: Photo[] = shuffleArray(PHOTOS);
export const DIWALI_EVENT_PHOTOS: Photo[] = [
  {
    category: "events",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1761265484/o/blcgy/events/diwali-2025/diwali.jpg",
    assetId: "3f36df730a5efa0d0893da113e162bd4",
    publicId: "o/blcgy/events/diwali-2025/diwali",
    width: 526,
    height: 715,
    format: "jpg",
    bytes: 69033,
    version: 1761265484,
    uploadedAt: "2025-10-24T00:24:44Z",
  },
];
