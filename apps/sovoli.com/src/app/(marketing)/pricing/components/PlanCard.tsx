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
import { CheckIcon, RocketIcon, MinusIcon, PlusIcon } from "lucide-react";
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
	const [quantityBasedCounts, setQuantityBasedCounts] = useState<
		Record<string, number>
	>({});

	const toggleOptional = (id: string) => {
		setSelectedOptionals((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	const incrementQuantity = (id: string) => {
		setQuantityBasedCounts((prev) => ({
			...prev,
			[id]: (prev[id] ?? 0) + 1,
		}));
	};

	const decrementQuantity = (id: string) => {
		setQuantityBasedCounts((prev) => ({
			...prev,
			[id]: Math.max(0, (prev[id] ?? 0) - 1),
		}));
	};

	// Split pricing items by billing cycle
	const baseItems = plan.pricingPackage.pricingItems.filter(
		(item) => !item.optional,
	);

	// Get all optional add-ons (excluding Campaign Ads which is shown separately)
	// This includes both regular optional items and quantity-based items
	const allOptionalItems = plan.pricingPackage.pricingItems.filter(
		(item) => item.optional && item.id !== "optional-campaign-ads",
	);

	// Separate quantity-based from regular optional items for rendering
	const quantityBasedItems = allOptionalItems.filter(
		(item) => item.isQuantityBased,
	);
	const regularOptionalItems = allOptionalItems.filter(
		(item) => !item.isQuantityBased,
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

	// Calculate quantity-based items cost
	const calculateQuantityBasedCost = (): AmountByCurrency => {
		const totals: AmountByCurrency = {};
		const currencies: CurrencyCode[] = ["USD", "GYD", "JMD"];

		for (const item of quantityBasedItems) {
			const quantity = quantityBasedCounts[item.id] ?? 0;
			if (quantity === 0) continue;

			for (const currency of currencies) {
				const perUnitAmount = getDiscountedAmount(item, currency);
				const itemTotal = perUnitAmount * quantity;
				totals[currency] = (totals[currency] ?? 0) + itemTotal;
			}
		}

		// Only include currencies with totals > 0
		for (const currency of currencies) {
			if ((totals[currency] ?? 0) <= 0) {
				delete totals[currency];
			}
		}

		return totals;
	};

	const oneTimeTotals = calculateTotals(oneTimeItems);
	const annualTotals = calculateTotals(annualItems);
	const quantityBasedCost = calculateQuantityBasedCost();

	// Calculate selected regular optional add-ons (non-quantity-based)
	const selectedRegularOptionals = regularOptionalItems.filter(
		(item) => selectedOptionals[item.id],
	);
	const selectedRegularOptionalsTotals = calculateTotals(
		selectedRegularOptionals,
	);

	// Calculate total "You pay now" (base plan + all selected optionals + quantity-based items)
	const totalPayNow: AmountByCurrency = {};
	const currencies: CurrencyCode[] = ["USD", "GYD", "JMD"];
	for (const currency of currencies) {
		const baseAnnual = annualTotals[currency] ?? 0;
		const baseOneTime = oneTimeTotals[currency] ?? 0;
		const regularOptionals = selectedRegularOptionalsTotals[currency] ?? 0;
		const quantityBased = quantityBasedCost[currency] ?? 0;
		const total = baseAnnual + baseOneTime + regularOptionals + quantityBased;
		if (total > 0) {
			totalPayNow[currency] = total;
		}
	}

	const selectedAddOnLabels = regularOptionalItems
		.filter((item) => selectedOptionals[item.id])
		.map((item) => item.label);

	// Add quantity-based items to WhatsApp message
	for (const item of quantityBasedItems) {
		const quantity = quantityBasedCounts[item.id] ?? 0;
		if (quantity > 0) {
			selectedAddOnLabels.push(`${quantity} ${item.label}`);
		}
	}

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

						{Object.entries(plan.features).filter(
							([_, feature]) => feature.show !== false,
						).length > 0 && (
							<>
								<h3 className="text-base font-semibold mb-2">
									What's Included:
								</h3>
								<ul className="space-y-3">
									{Object.entries(plan.features)
										.filter(([_, feature]) => feature.show !== false)
										.map(([key, feature]) => (
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

						{/* Add-ons - combines both regular optional items and quantity-based items */}
						{allOptionalItems.length > 0 && (
							<>
								<h3 className="text-base font-semibold mt-5 mb-2">Add-ons:</h3>
								<div className="space-y-3">
									{/* Quantity-based items */}
									{quantityBasedItems.map((item) => {
										const quantity = quantityBasedCounts[item.id] ?? 0;
										const itemCost: AmountByCurrency = {};
										const currencies: CurrencyCode[] = ["USD", "GYD", "JMD"];

										for (const currency of currencies) {
											const perUnitAmount = getDiscountedAmount(item, currency);
											const total = perUnitAmount * quantity;
											if (total > 0) {
												itemCost[currency] = total;
											}
										}

										return (
											<div
												key={item.id}
												className="p-4 bg-default-50 rounded-lg border border-default-200"
											>
												<div className="flex items-center justify-between mb-2">
													<div className="flex flex-col">
														<span className="text-sm font-medium">
															{item.label}
														</span>
														{item.description && (
															<span className="text-xs text-default-500 mt-1">
																{item.description}
															</span>
														)}
													</div>
												</div>
												<div className="flex items-center justify-between mt-3">
													<div className="flex items-center gap-3">
														<Button
															variant="bordered"
															size="sm"
															onClick={() => decrementQuantity(item.id)}
															disabled={quantity === 0}
															className="min-w-[2.5rem]"
															isIconOnly
														>
															<MinusIcon className="w-4 h-4" />
														</Button>
														<span className="text-lg font-semibold min-w-[2rem] text-center">
															{quantity}
														</span>
														<Button
															variant="bordered"
															size="sm"
															onClick={() => incrementQuantity(item.id)}
															className="min-w-[2.5rem]"
															isIconOnly
														>
															<PlusIcon className="w-4 h-4" />
														</Button>
													</div>
													<div className="text-right">
														<div className="text-sm text-default-600">
															Per unit:
														</div>
														<div className="text-base font-semibold text-success-600">
															<Price
																amount={item.amount}
																preferredCurrency={preferredCurrency}
															/>
														</div>
														{quantity > 0 && (
															<div className="text-xs text-default-500 mt-1">
																Total:{" "}
																<span className="font-semibold">
																	<Price
																		amount={itemCost}
																		preferredCurrency={preferredCurrency}
																	/>
																</span>
															</div>
														)}
													</div>
												</div>
											</div>
										);
									})}

									{/* Regular optional items */}
									{regularOptionalItems.length > 0 && (
										<div className="flex flex-wrap gap-2">
											{regularOptionalItems.map((item) => (
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
									)}
								</div>
							</>
						)}
					</CardBody>
				</>
			)}

			<CardFooter className="flex flex-col items-start pt-4 gap-2">
				<div className="w-full space-y-2">
					{/* Base Plan */}
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

					{/* You Pay Now - total of base plan + all selected optionals */}
					<div className="w-full p-3 bg-primary-50 rounded-lg border border-primary-200">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-primary-700">
								You pay now:
							</span>
							<div className="flex items-center gap-2">
								<span className="text-lg font-semibold text-primary-700">
									<Price
										amount={totalPayNow}
										preferredCurrency={preferredCurrency}
									/>
								</span>
							</div>
						</div>
						{(selectedRegularOptionals.length > 0 ||
							quantityBasedItems.some(
								(item) => (quantityBasedCounts[item.id] ?? 0) > 0,
							)) && (
							<div className="text-xs text-primary-600 mt-1">
								Includes base plan
								{selectedRegularOptionals.length > 0 && (
									<>
										{" "}
										+ {selectedRegularOptionals.length} optional add-on
										{selectedRegularOptionals.length > 1 ? "s" : ""}
									</>
								)}
								{quantityBasedItems.some(
									(item) => (quantityBasedCounts[item.id] ?? 0) > 0,
								) && (
									<>
										{selectedRegularOptionals.length > 0 && ", "}
										{quantityBasedItems
											.filter((item) => (quantityBasedCounts[item.id] ?? 0) > 0)
											.map(
												(item) =>
													`${quantityBasedCounts[item.id]} ${item.label}`,
											)
											.join(", ")}
									</>
								)}
							</div>
						)}
					</div>
				</div>

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
