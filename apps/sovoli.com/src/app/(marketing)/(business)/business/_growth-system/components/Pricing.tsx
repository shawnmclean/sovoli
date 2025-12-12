"use client";

import { growthPlan } from "~/modules/plans/data/growth";
import { PlanCard } from "../../../../pricing/components/PlanCard";
import type { CurrencyCode } from "~/utils/currencyDetection";

interface PricingProps {
	preferredCurrency?: CurrencyCode;
}

export function Pricing({ preferredCurrency = "USD" }: PricingProps) {
	return (
		<section className="py-12 px-4 sm:py-16">
			<div className="mx-auto max-w-4xl">
				<div className="text-center mb-8 sm:mb-12">
					<h2 className="text-2xl sm:text-3xl font-bold">Pricing</h2>
				</div>

				<PlanCard
					plan={growthPlan}
					showDetails={true}
					isPrimary={true}
					hideHeader={true}
					hideCta={true}
					preferredCurrency={preferredCurrency}
				/>
			</div>
		</section>
	);
}
