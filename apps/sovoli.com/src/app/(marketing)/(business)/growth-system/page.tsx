import { Overview } from "./components/Overview";
import { Customers } from "./components/Customers";
import { Features } from "./components/Features";
import { Answers } from "./components/Answers";
import { Pricing } from "./components/Pricing";
import { CTA } from "./components/CTA";
import type { TrackingEventProperties } from "./components/Tracking";
import { Tracking } from "./components/Tracking";
// import { Roadmap } from "./components/Roadmap";
// import { Compare } from "./components/Compare";
import { headers } from "next/headers";
import { detectCurrency } from "~/utils/currencyDetection";

export const metadata = {
	title: "Growth System – Sovoli",
	description:
		"A complete digital visibility and lead system built for small private schools in Guyana. Turn parent searches into enrollment conversations automatically.",
};

export default async function GrowthSystemPage() {
	const headersList = await headers();
	const preferredCurrency = detectCurrency(headersList);

	const trackingProperties: TrackingEventProperties = {
		content_name: "Growth System",
		content_type: "product",
		content_ids: ["growth-system"],
		value: 80000,
		currency: "GYD",
		predicted_ltv: 1200000,
		audience: "school-admin",
	};
	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-default-50">
			<Tracking trackingEventProperties={trackingProperties} />
			<Overview />
			<Customers />
			<Features />
			<Pricing preferredCurrency={preferredCurrency} />
			<Answers />
			<CTA trackingEventProperties={trackingProperties} />
			{/* <Roadmap /> */}
			{/* <Compare /> */}
		</div>
	);
}
