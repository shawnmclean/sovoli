export type BusinessCategory =
  | "k12-education"
  | "beauty-wellness"
  | "fashion-apparel"
  | "bookstores"
  | "agriculture"
  | "hardware";

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
    id: "k12-education",
    label: "K12 Education",
    headlineLabel: "Private Schools",
    shortDescription:
      "Turn parent searches into enrollment conversations with a complete Growth System.",
    heroTitle: "Growth Systems for K-12 Schools",
    heroSubtitle:
      "Get discovered on Google, build a professional website, and convert interest into enrollment conversations.",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    gradient: "from-blue-500 via-indigo-500 to-violet-500",
  },
  {
    id: "beauty-wellness",
    label: "Beauty & Wellness",
    headlineLabel: "Beauty Businesses",
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
    id: "fashion-apparel",
    label: "Fashion & Apparel",
    headlineLabel: "Fashion Businesses",
    shortDescription:
      "Reach customers searching for fashion and clothing and convert clicks into sales conversations.",
    heroTitle: "Growth Systems for Fashion & Apparel Stores",
    heroSubtitle:
      "Get discovered online, showcase your products, and turn customer searches into inquiries and sales.",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
  },
  {
    id: "bookstores",
    label: "Bookstores",
    headlineLabel: "Bookstores",
    shortDescription:
      "Reach customers searching for books and textbooks and convert clicks into sales conversations.",
    heroTitle: "Growth Systems for Bookstores",
    heroSubtitle:
      "Get discovered online, showcase your catalog, and turn customer searches into inquiries and sales.",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
    gradient: "from-amber-500 via-orange-500 to-red-500",
  },
  {
    id: "agriculture",
    label: "Agriculture",
    headlineLabel: "Farms",
    shortDescription:
      "Get found by customers searching for agricultural products and services and convert clicks into sales.",
    heroTitle: "Growth Systems for Agriculture Businesses",
    heroSubtitle:
      "Get discovered online, showcase your products, and turn customer searches into inquiries and sales.",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
  },
  {
    id: "hardware",
    label: "Hardware",
    headlineLabel: "Hardware Stores",
    shortDescription:
      "Reach customers searching for hardware and tools and convert clicks into sales conversations.",
    heroTitle: "Growth Systems for Hardware Stores",
    heroSubtitle:
      "Get discovered online, showcase your products, and turn customer searches into inquiries and sales.",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
    gradient: "from-slate-500 via-gray-500 to-zinc-500",
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
