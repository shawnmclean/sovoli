import { headers } from "next/headers";
import { detectCurrency } from "~/utils/currencyDetection";
import { getContent } from "../../_growth-system/content";
import { Overview } from "../../_growth-system/components/Overview";
import { Customers } from "../../_growth-system/components/Customers";
import { Features } from "../../_growth-system/components/Features";
import { Answers } from "../../_growth-system/components/Answers";
import { Pricing } from "../../_growth-system/components/Pricing";
import { CTA } from "../../_growth-system/components/CTA";
import { Tracking } from "../../_growth-system/components/Tracking";
import type { TrackingEventProperties } from "../../_growth-system/components/Tracking";

export const metadata = {
	title: "Growth System for K-12 Schools – Sovoli",
	description:
		"A complete digital visibility and lead system built for small private schools in Guyana. Turn parent searches into enrollment conversations automatically.",
};

export default async function K12GrowthSystemPage() {
	const headersList = await headers();
	const preferredCurrency = detectCurrency(headersList);
	const content = getContent("k12");
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
