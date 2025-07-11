import type { Photo } from "~/modules/academics/types";

const PHOTOS: Photo[] = [
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/1.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/2.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/3.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/4.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/5.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/6.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/7.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/8.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/9.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/10.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/11.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/12.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/13.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/14.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/15.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/16.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/17.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/18.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/19.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/20.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/21.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/22.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/23.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/24.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/25.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/26.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/27.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/28.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/29.webp",
  },
  {
    category: "default",
    url: "/orgs/private-schools/guyana/modernacademy/photos/30.webp",
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

export const PRE_NURSERY_PHOTOS: Photo[] = shuffleArray(PHOTOS);
export const NURSERY_PHOTOS: Photo[] = shuffleArray(PHOTOS);
export const PRIMARY_PHOTOS: Photo[] = shuffleArray(PHOTOS);
export const SECONDARY_PHOTOS: Photo[] = shuffleArray(PHOTOS);
