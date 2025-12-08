"use client";

import { useState } from "react";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
} from "@sovoli/ui/components/card";
import { Divider } from "@sovoli/ui/components/divider";
import { Button } from "@sovoli/ui/components/button";
import { CheckIcon, RocketIcon } from "lucide-react";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Price } from "./Price";
import type { PlanDefinition } from "~/modules/plans/types";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import type {
	PricingItem,
	AmountByCurrency,
} from "~/modules/core/economics/types";
import type { CurrencyCode } from "~/utils/currencyDetection";

interface PlanCardProps {
	plan: PlanDefinition;
	showDetails: boolean;
	onToggleDetails?: () => void;
	isPrimary?: boolean;
	orgUsername?: string;
	hideHeader?: boolean; // hide plan title/subtitle
	hideCta?: boolean; // hide CTA button
	preferredCurrency?: CurrencyCode;
}

export function PlanCard({
	plan,
	showDetails,
	onToggleDetails,
	isPrimary = false,
	orgUsername,
	hideHeader = false,
	hideCta = false,
	preferredCurrency = "USD",
}: PlanCardProps) {
	const [selectedOptionals, setSelectedOptionals] = useState<
		Record<string, boolean>
	>({});

	const toggleOptional = (id: string) => {
		setSelectedOptionals((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	// Split pricing items by billing cycle
	const baseItems = plan.pricingPackage.pricingItems.filter(
		(item) => !item.optional,
	);
	// Exclude Campaign Ads from regular optional items (shown separately)
	const optionalItems = plan.pricingPackage.pricingItems.filter(
		(item) => item.optional && item.id !== "optional-campaign-ads",
	);

	// Group base items by billing cycle
	const oneTimeItems = baseItems.filter(
		(item) => item.billingCycle === "one-time",
	);
	const annualItems = baseItems.filter(
		(item) => item.billingCycle === "annual",
	);

	// Apply active discounts
	const getDiscountedAmount = (
		item: PricingItem,
		currency: CurrencyCode,
	): number => {
		const base = item.amount[currency] ?? 0;
		const now = new Date().toISOString();

		// Check for item-specific discounts first
		const activeDiscount = plan.pricingPackage.discounts?.find(
			(d) =>
				d.type === "percentage" &&
				d.appliesTo.includes(item.id) &&
				(!d.validFrom || d.validFrom <= now) &&
				(!d.validUntil || d.validUntil >= now),
		);

		if (activeDiscount) {
			return base * (1 - activeDiscount.value / 100);
		}

		return base;
	};

	// Compute totals by billing cycle for all currencies
	const calculateTotals = (items: PricingItem[]): AmountByCurrency => {
		const totals: AmountByCurrency = {};
		const currencies: CurrencyCode[] = ["USD", "GYD", "JMD"];

		for (const currency of currencies) {
			const total = items.reduce(
				(sum, item) => sum + getDiscountedAmount(item, currency),
				0,
			);
			// Only include currency if total is greater than 0
			if (total > 0) {
				totals[currency] = total;
			}
		}

		return totals;
	};

	const oneTimeTotals = calculateTotals(oneTimeItems);
	const annualTotals = calculateTotals(annualItems);

	const selectedAddOnLabels = optionalItems
		.filter((item) => selectedOptionals[item.id])
		.map((item) => item.label);

	const whatsappMessage =
		selectedAddOnLabels.length > 0
			? `Hello, I'm interested in the ${plan.key} plan with these add-ons: ${selectedAddOnLabels.join(", ")}${orgUsername ? ` for ${orgUsername}` : ""}`
			: `Hello, I'm interested in the ${plan.key} plan${orgUsername ? ` for ${orgUsername}` : ""}`;

	return (
		<Card className="overflow-visible flex flex-col">
			<CardHeader className="flex flex-col items-start gap-2 pb-3">
				<div className="flex justify-between w-full items-center">
					{!hideHeader && (
						<div>
							<h2 className="text-xl font-semibold">{plan.title}</h2>
							{plan.subtitle && (
								<p className="text-sm text-default-500">{plan.subtitle}</p>
							)}
						</div>
					)}
					{!isPrimary && onToggleDetails && (
						<button
							type="button"
							className="text-sm text-primary font-medium"
							onClick={onToggleDetails}
						>
							{showDetails ? "Hide" : "Show"} Details
						</button>
					)}
				</div>

				{/* Discount Badge */}
				{(() => {
					const now = new Date().toISOString();
					const baseDiscount = plan.pricingPackage.discounts?.find(
						(d) =>
							d.type === "percentage" &&
							d.appliesTo.includes("base-plan") &&
							(!d.validFrom || d.validFrom <= now) &&
							(!d.validUntil || d.validUntil >= now),
					);

					return baseDiscount ? (
						<div className="bg-success-50 border border-success-200 rounded-lg px-3 py-1">
							<div className="flex items-center gap-2">
								<span className="text-success-700 font-semibold text-sm">
									{baseDiscount.value}% OFF
								</span>
								{baseDiscount.message && (
									<span className="text-success-600 text-xs">
										• {baseDiscount.message}
									</span>
								)}
							</div>
						</div>
					) : null;
				})()}

				{/* Main pricing - annual fee */}
				<div className="mt-1">
					<div className="text-3xl font-bold text-primary">
						<Price
							amount={annualTotals}
							preferredCurrency={preferredCurrency}
						/>
					</div>
					<div className="text-sm text-default-500 mt-1">/ year</div>
				</div>

				{/* One-time items if any */}
				{Object.keys(oneTimeTotals).length > 0 && (
					<div className="text-sm text-default-600 mt-2">
						<span>Plus one-time: </span>
						<span className="font-semibold">
							<Price
								amount={oneTimeTotals}
								preferredCurrency={preferredCurrency}
							/>
						</span>
					</div>
				)}

				{plan.onboardingNode && (
					<div className="mt-3 p-3 bg-warning-50 border border-warning-200 rounded-lg animate-pulse">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-warning-500 rounded-full animate-bounce"></div>
							<p className="text-warning-700 text-sm font-medium">
								{plan.onboardingNode}
							</p>
						</div>
					</div>
				)}
			</CardHeader>

			{showDetails && (
				<>
					<Divider />
					<CardBody className="py-4 flex-grow">
						{plan.description && (
							<p className="mb-4 text-sm">{plan.description}</p>
						)}

						{Object.values(plan.features).length > 0 && (
							<>
								<h3 className="text-base font-semibold mb-2">
									What's Included:
								</h3>
								<ul className="space-y-3">
									{Object.entries(plan.features).map(([key, feature]) => (
										<li key={key} className="flex items-start text-sm gap-2">
											<CheckIcon className="text-success mt-1 h-4 w-4 shrink-0" />
											<div className="flex flex-col">
												<span className="font-medium">{feature.label}</span>
												{feature.pitch && (
													<span className="text-xs italic text-default-500">
														{feature.pitch}
													</span>
												)}
											</div>
										</li>
									))}
								</ul>
							</>
						)}

						{optionalItems.length > 0 && (
							<>
								<h3 className="text-base font-semibold mt-5 mb-2">
									Optional Add-ons:
								</h3>
								<div className="flex flex-wrap gap-2">
									{optionalItems.map((item) => (
										<div
											key={item.id}
											className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm cursor-pointer transition-colors ${
												selectedOptionals[item.id]
													? "bg-success-50 border border-success-200"
													: "hover:bg-default-50 border border-transparent"
											}`}
										>
											<Checkbox
												id={`optional-${item.id}`}
												color="success"
												isSelected={!!selectedOptionals[item.id]}
												onValueChange={() => toggleOptional(item.id)}
											/>
											<label
												htmlFor={`optional-${item.id}`}
												className="flex flex-col text-sm cursor-pointer"
											>
												<span className="font-medium">{item.label}</span>
												{item.description && (
													<span className="text-xs text-default-500 italic mt-1">
														{item.description}
													</span>
												)}
												<span className="text-xs text-success-600 font-semibold mt-1">
													+{" "}
													<Price
														amount={item.amount}
														preferredCurrency={preferredCurrency}
													/>
												</span>
											</label>
										</div>
									))}
								</div>
							</>
						)}
					</CardBody>
				</>
			)}

			<CardFooter className="flex flex-col items-start pt-4 gap-2">
				{optionalItems.length > 0 && (
					<div className="w-full p-3 bg-default-50 rounded-lg border border-default-200">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-default-700">
								Base Plan:
							</span>
							<div className="flex items-center gap-2">
								<span className="text-lg font-semibold">
									<Price
										amount={annualTotals}
										preferredCurrency={preferredCurrency}
									/>
									<span className="text-xs font-normal text-default-500 ml-1">
										/ year
									</span>
								</span>
							</div>
						</div>
					</div>
				)}

				{!hideCta && (
					<Button
						as={WhatsAppLink}
						message={whatsappMessage}
						color="primary"
						variant="solid"
						size="lg"
						className="w-full mt-2"
						endContent={<RocketIcon className="w-4 h-4" />}
						intent="Purchase"
						role="admin"
						page="pricing"
						orgId={orgUsername}
						funnel="upgrade"
					>
						Launch My School
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
