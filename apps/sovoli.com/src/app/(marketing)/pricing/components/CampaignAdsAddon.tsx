"use client";

import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
} from "@sovoli/ui/components/card";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Button } from "@sovoli/ui/components/button";
import { RocketIcon } from "lucide-react";
import { Price } from "./Price";
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
	isSelected,
	onToggle,
	orgUsername,
	preferredCurrency = "USD",
}: CampaignAdsAddonProps) {
	return (
		<Card className="overflow-visible border-2 border-primary/20">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<div className="flex items-center gap-3">
							<Checkbox
								color="primary"
								isSelected={isSelected}
								onValueChange={onToggle}
								size="lg"
							/>
							<div>
								<h3 className="text-lg font-semibold">
									{campaignAdsItem.label}
								</h3>
								{campaignAdsItem.description && (
									<p className="text-sm text-default-600 mt-1">
										{campaignAdsItem.description}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</CardHeader>

			<CardBody className="pt-0">
				<div className="space-y-3">
					<div className="flex items-baseline gap-2">
						<span className="text-2xl font-bold text-primary">$50</span>
						<span className="text-base text-default-600">/ week</span>
						<span className="text-sm text-default-500">(minimum)</span>
					</div>
					<div className="text-sm text-default-600">
						<p>Annual equivalent:</p>
						<div className="mt-1 font-semibold text-default-700">
							<Price
								amount={campaignAdsItem.amount}
								preferredCurrency={preferredCurrency}
							/>
							<span className="text-xs font-normal text-default-500 ml-1">
								/ year
							</span>
						</div>
					</div>
					{campaignAdsItem.notes && (
						<p className="text-xs text-default-500 italic">
							{campaignAdsItem.notes}
						</p>
					)}
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
