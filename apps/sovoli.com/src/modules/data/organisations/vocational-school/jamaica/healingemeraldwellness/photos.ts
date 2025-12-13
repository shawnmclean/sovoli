import type { Media } from "~/modules/core/media/types";

const HEALING_EMERALD_MASSAGE_THERAPY_PHOTOS: Media[] = [
  {
    type: "image",
    category: "default",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1765637928/o/healingemeraldwellness/programs/massage-therapy/massage-model.jpg",
    assetId: "46539ba9b6db4691b60461c7681873d5",
    publicId: "o/healingemeraldwellness/programs/massage-therapy/massage-model",
    width: 1536,
    height: 1024,
    format: "jpg",
    bytes: 223961,
    version: 1765637928,
  },
  {
    type: "image",
    category: "default",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1765637929/o/healingemeraldwellness/programs/massage-therapy/reception-area.jpg",
    assetId: "9ec095d13942e190bcd8cba6459695a0",
    publicId:
      "o/healingemeraldwellness/programs/massage-therapy/reception-area",
    width: 1056,
    height: 1280,
    format: "jpg",
    bytes: 289066,
    version: 1765637929,
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

export const MASSAGE_THERAPY_PHOTOS: Media[] = shuffleArray(
  HEALING_EMERALD_MASSAGE_THERAPY_PHOTOS,
);

export const HEALING_EMERALD_PHOTOS: Media[] = [...MASSAGE_THERAPY_PHOTOS];
