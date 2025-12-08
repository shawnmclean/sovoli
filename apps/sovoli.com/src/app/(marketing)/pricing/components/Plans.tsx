// components/Plans.tsx
"use client";

import { useState, useMemo } from "react";
import type { RuleSet } from "~/modules/scoring/types";
import type { PlanDefinition } from "~/modules/plans/types";
import type { CurrencyCode } from "~/utils/currencyDetection";
import { detectCurrencyFromTimezone } from "~/utils/currencyDetection";
import { PlanCard } from "./PlanCard";
import { CampaignAdsAddon } from "./CampaignAdsAddon";

interface PlansProps {
	plans: PlanDefinition[];
	ruleSet: RuleSet;
	orgUsername?: string;
	preferredCurrency?: CurrencyCode;
}

export function Plans({
	plans,
	ruleSet: _ruleSet,
	orgUsername,
	preferredCurrency: serverCurrency = "USD",
}: PlansProps) {
	const [expanded, setExpanded] = useState<Record<string, boolean>>({});
	const [selectedCampaignAds, setSelectedCampaignAds] = useState(false);

	// On client, enhance currency detection with timezone if server didn't detect
	const preferredCurrency = useMemo<CurrencyCode>(() => {
		// If server returned USD (default), try client-side detection
		if (serverCurrency === "USD") {
			const clientCurrency = detectCurrencyFromTimezone();
			return clientCurrency;
		}
		return serverCurrency;
	}, [serverCurrency]);

	const toggleExpand = (planKey: string) => {
		setExpanded((prev) => ({
			...prev,
			[planKey]: !prev[planKey],
		}));
	};

	// Find Campaign Ads item from growth plan
	const growthPlan = plans.find((p) => p.key === "growth");
	const campaignAdsItem = growthPlan?.pricingPackage.pricingItems.find(
		(item) => item.id === "optional-campaign-ads",
	);

	return (
		<>
			{plans.map((plan, idx) => {
				const showDetails = (idx === 0 || expanded[plan.key]) ?? false;

				return (
					<PlanCard
						key={plan.key}
						plan={plan}
						showDetails={showDetails}
						onToggleDetails={() => toggleExpand(plan.key)}
						isPrimary={idx === 0}
						orgUsername={orgUsername}
						preferredCurrency={preferredCurrency}
					/>
				);
			})}

			{/* Campaign Ads Add-on - shown separately below */}
			{campaignAdsItem && (
				<div className="mt-8">
					<CampaignAdsAddon
						campaignAdsItem={campaignAdsItem}
						isSelected={selectedCampaignAds}
						onToggle={() => setSelectedCampaignAds(!selectedCampaignAds)}
						orgUsername={orgUsername}
						preferredCurrency={preferredCurrency}
					/>
				</div>
			)}
		</>
	);
}
