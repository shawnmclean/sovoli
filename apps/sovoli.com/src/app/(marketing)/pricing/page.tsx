import { Plans } from "./components/Plans";
import { plans } from "~/modules/plans/data";
import { categoryRuleSets } from "~/modules/scoring/ruleSets";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { detectCurrency } from "~/utils/currencyDetection";
import { Answers } from "../(business)/growth-system/components/Answers";
import { getContent } from "../(business)/growth-system/content";

export const metadata: Metadata = {
	title: "Pricing Plans",
	description:
		"Choose the plan that fits your needs and watch your school's visibility soar",
};

export default async function PricingPage({
	searchParams,
}: {
	searchParams: Promise<{ org: string }>;
}) {
	const { org } = await searchParams;
        const headersList = await headers();
        const preferredCurrency = detectCurrency(headersList);
        const { answers } = getContent("k12");

        const ruleSet = categoryRuleSets["private-school"];

	if (!ruleSet) {
		return <div>No rule set found</div>;
	}

	return (
		<main className="min-h-screen">
			{/* Hero Section */}
			<section className="relative overflow-hidden">
				{/* Background pattern */}
				<div className="absolute inset-0 -z-10">
					<div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-background to-background dark:from-primary-950/20" />
					<div
						className="absolute inset-0 opacity-[0.03]"
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
						}}
					/>
				</div>

				<div className="mx-auto max-w-6xl px-4 py-10 sm:py-16 md:py-20 lg:px-12">
					<div className="text-center">
						<h1 className="mb-6 text-center text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
							<span className="block text-foreground">Pricing Plans</span>
							<span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
								For Your School
							</span>
						</h1>

						<p className="mx-auto mb-12 max-w-2xl text-center text-lg text-default-600 sm:text-xl">
							Choose the plan that fits your needs and watch your school's
							visibility soar. All plans include our core digital growth tools.
						</p>
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-24">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					<Plans
						plans={plans}
						ruleSet={ruleSet}
						orgUsername={org}
						preferredCurrency={preferredCurrency}
					/>
				</div>
			</section>

                        {/* FAQ Section */}
                        <Answers content={answers} />
                </main>
        );
}
