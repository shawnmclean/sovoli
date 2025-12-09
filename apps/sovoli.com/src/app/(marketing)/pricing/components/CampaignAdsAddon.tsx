"use client";

import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
} from "@sovoli/ui/components/card";
import { Button } from "@sovoli/ui/components/button";
import { RocketIcon, CheckIcon } from "lucide-react";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import type { PricingItem } from "~/modules/core/economics/types";
import type { CurrencyCode } from "~/utils/currencyDetection";

interface CampaignAdsAddonProps {
	campaignAdsItem: PricingItem;
	isSelected: boolean;
	onToggle: () => void;
	orgUsername?: string;
	preferredCurrency?: CurrencyCode;
}

export function CampaignAdsAddon({
	campaignAdsItem,
	isSelected: _isSelected,
	onToggle: _onToggle,
	orgUsername,
	preferredCurrency: _preferredCurrency = "USD",
}: CampaignAdsAddonProps) {
	return (
		<Card className="overflow-visible border-2 border-primary/20">
			<CardHeader className="pb-3">
				<div>
					<h3 className="text-lg font-semibold">{campaignAdsItem.label}</h3>
					<p className="text-sm text-default-600 mt-1">
						We handle everything for your Meta advertising campaigns
					</p>
				</div>
			</CardHeader>

			<CardBody className="pt-0">
				<div className="space-y-4">
					<div className="space-y-2">
						<p className="text-sm text-default-700 font-medium">
							What we do for you:
						</p>
						<ul className="space-y-2">
							<li className="flex items-start gap-2 text-sm">
								<CheckIcon className="text-success mt-0.5 h-4 w-4 shrink-0" />
								<span className="text-default-600">
									Generate compelling ad copy that converts
								</span>
							</li>
							<li className="flex items-start gap-2 text-sm">
								<CheckIcon className="text-success mt-0.5 h-4 w-4 shrink-0" />
								<span className="text-default-600">
									Create eye-catching images for your campaigns
								</span>
							</li>
							<li className="flex items-start gap-2 text-sm">
								<CheckIcon className="text-success mt-0.5 h-4 w-4 shrink-0" />
								<span className="text-default-600">
									Target the right audience for maximum reach
								</span>
							</li>
							<li className="flex items-start gap-2 text-sm">
								<CheckIcon className="text-success mt-0.5 h-4 w-4 shrink-0" />
								<span className="text-default-600">
									Run and manage your campaigns end-to-end
								</span>
							</li>
						</ul>
					</div>

					<div className="pt-2 border-t border-default-200">
						<div className="flex items-baseline gap-2">
							<span className="text-2xl font-bold text-primary">$50</span>
							<span className="text-base text-default-600">/ week</span>
							<span className="text-sm text-default-500">(minimum)</span>
						</div>
						<p className="text-xs text-default-500 mt-2">
							Minimum 1 week campaign duration. The minimum spend helps us get
							results and train our system to optimize your campaigns for better
							performance.
						</p>
					</div>
				</div>
			</CardBody>

			<CardFooter>
				<Button
					as={WhatsAppLink}
					message={`Hello, I'm interested in Campaign Ads (Meta ads management - minimum $50/week)${orgUsername ? ` for ${orgUsername}` : ""}`}
					color="primary"
					variant="solid"
					size="lg"
					className="w-full"
					endContent={<RocketIcon className="w-4 h-4" />}
					intent="Purchase"
					role="admin"
					page="pricing"
					orgId={orgUsername}
					funnel="upgrade"
				>
					Get Started with Ads
				</Button>
			</CardFooter>
		</Card>
	);
}
