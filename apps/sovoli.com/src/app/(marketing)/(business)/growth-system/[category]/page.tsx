import { Overview } from "../components/Overview";
import { Customers } from "../components/Customers";
import { Features } from "../components/Features";
import { Answers } from "../components/Answers";
import { Pricing } from "../components/Pricing";
import { CTA } from "../components/CTA";
import type { TrackingEventProperties } from "../components/Tracking";
import { Tracking } from "../components/Tracking";
import { headers } from "next/headers";
import { detectCurrency } from "~/utils/currencyDetection";
import type { Category } from "../content";
import { getContent } from "../content";
import { notFound } from "next/navigation";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ category: string }>;
}) {
	const { category } = await params;
	const validCategories: Category[] = ["k12", "skills-training", "bookstore"];

	if (!validCategories.includes(category as Category)) {
		return {
			title: "Growth System – Sovoli",
		};
	}

	const content = getContent(category as Category);
	return {
		title: content.metadata.title,
		description: content.metadata.description,
	};
}

export default async function GrowthSystemCategoryPage({
	params,
}: {
	params: Promise<{ category: string }>;
}) {
	const { category } = await params;
	const validCategories: Category[] = ["k12", "skills-training", "bookstore"];

	if (!validCategories.includes(category as Category)) {
		notFound();
	}

	const headersList = await headers();
	const preferredCurrency = detectCurrency(headersList);
	const content = getContent(category as Category);

	const trackingProperties: TrackingEventProperties =
		content.tracking as TrackingEventProperties;

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-default-50">
			<Tracking trackingEventProperties={trackingProperties} />
			<Overview content={content.overview} />
			<Customers content={content.customers} />
			<Features content={content.features} />
			<Pricing preferredCurrency={preferredCurrency} />
			<Answers
				content={content.answers}
				trackingEventProperties={trackingProperties}
			/>
			<CTA content={content.cta} trackingEventProperties={trackingProperties} />
		</div>
	);
}
