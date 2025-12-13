export type BusinessCategory =
  | "k12-schools"
  | "beauty-wellness"
  | "fashion-sewing"
  | "farms-agriculture"
  | "fitness-sports"
  | "creative-arts";

export interface BusinessCategoryMeta {
  id: BusinessCategory;
  label: string;
  headlineLabel: string;
  shortDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  image: string;
  gradient: string;
}

export const BUSINESS_CATEGORIES: BusinessCategoryMeta[] = [
  {
    id: "k12-schools",
    label: "K-12 Schools",
    headlineLabel: "Schools",
    shortDescription: "Turn parent searches into enrollment conversations.",
    heroTitle: "Growth Systems for K-12 Schools & Academies",
    heroSubtitle:
      "Get discovered on search, showcase programs, and convert interest into tours and applications.",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    gradient: "from-blue-500 via-indigo-500 to-violet-500",
  },
  {
    id: "beauty-wellness",
    label: "Beauty & Wellness",
    headlineLabel: "Beauty",
    shortDescription:
      "Get found by customers searching for beauty and wellness services and convert clicks into bookings.",
    heroTitle: "Growth Systems for Beauty & Wellness Businesses",
    heroSubtitle:
      "Get discovered online, showcase your services, and turn customer searches into appointments and sales.",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    gradient: "from-pink-500 via-rose-500 to-fuchsia-500",
  },
  {
    id: "fashion-sewing",
    label: "Fashion & Sewing",
    headlineLabel: "Fashion",
    shortDescription: "Bring shoppers searching for outfits, fabrics, and alterations.",
    heroTitle: "Growth Systems for Fashion & Sewing Brands",
    heroSubtitle:
      "Showcase collections, custom work, and services while turning searches into sales and bookings.",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
  },
  {
    id: "farms-agriculture",
    label: "Farms & Agriculture",
    headlineLabel: "Farms",
    shortDescription: "Connect with buyers for produce, livestock, and farm services.",
    heroTitle: "Growth Systems for Farms & Agriculture",
    heroSubtitle:
      "Share offerings, seasonal availability, and services while turning searches into sales inquiries.",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
  },
  {
    id: "fitness-sports",
    label: "Fitness & Sports",
    headlineLabel: "Fitness",
    shortDescription: "Drive membership, class bookings, and event signups.",
    heroTitle: "Growth Systems for Fitness & Sports Brands",
    heroSubtitle:
      "Show schedules, trainers, and programs while converting searches into memberships and tickets.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
  },
  {
    id: "creative-arts",
    label: "Creative Arts",
    headlineLabel: "Creative",
    shortDescription: "Attract students, patrons, and clients for creative services.",
    heroTitle: "Growth Systems for Creative Arts",
    heroSubtitle:
      "Promote classes, events, and commissions while turning interest into bookings and sales.",
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
    gradient: "from-slate-500 via-blue-500 to-cyan-500",
  },
];

export function isBusinessCategory(value: string): value is BusinessCategory {
  return BUSINESS_CATEGORIES.some((c) => c.id === value);
}

export function getBusinessCategoryMeta(
  category: BusinessCategory,
): BusinessCategoryMeta {
  const meta = BUSINESS_CATEGORIES.find((c) => c.id === category);
  if (!meta) {
    // Should be impossible when category is typed correctly.
    throw new Error(`Unknown business category: ${category}`);
  }
  return meta;
}

export function businessCategoryHref(category: BusinessCategory) {
  return `/business/${category}`;
}
