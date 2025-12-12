export type BusinessCategory = "k12" | "skills-training" | "bookstore";

export interface BusinessCategoryMeta {
	id: BusinessCategory;
	label: string;
	shortDescription: string;
	heroTitle: string;
	heroSubtitle: string;
	image: string;
	gradient: string;
}

export const BUSINESS_CATEGORIES: BusinessCategoryMeta[] = [
	{
		id: "k12",
		label: "K-12 Schools",
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
		id: "skills-training",
		label: "Skills Training",
		shortDescription:
			"Get found by students searching for training programs and capture leads automatically.",
		heroTitle: "Growth Systems for Skills Training Centers",
		heroSubtitle:
			"Show up in search, run targeted ads, and turn student interest into enrollment conversations.",
		image:
			"https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
		gradient: "from-emerald-500 via-teal-500 to-cyan-500",
	},
	{
		id: "bookstore",
		label: "Bookstores",
		shortDescription:
			"Reach customers searching for books and textbooks and convert clicks into sales conversations.",
		heroTitle: "Growth Systems for Bookstores",
		heroSubtitle:
			"Get discovered online, showcase your catalog, and turn customer searches into inquiries and sales.",
		image:
			"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
		gradient: "from-amber-500 via-orange-500 to-red-500",
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
