"use client";

import { useEffect, useState, useMemo } from "react";
import type { Program, RequirementList, RequirementListEntry } from "~/modules/academics/types";
import type { Item } from "~/modules/core/items/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { ORGS } from "~/modules/data/organisations";

export interface Supplier {
	name: string;
	price: number;
	org: OrgInstance;
}

export interface SuppliesItem {
	item: Item;
	quantity?: number;
	unit?: string;
	notes?: string;
}

// Function to get supplier data for an item from recommended suppliers
function getSupplierDataForItem(
	itemId: string,
	recommendedSuppliers: OrgInstance[],
): Supplier[] {
	const suppliers: Supplier[] = [];

	recommendedSuppliers.forEach((supplierOrg) => {
		// Check if this supplier has a catalog module
		if (supplierOrg.catalogModule?.items) {
			// Find the item in the supplier's catalog
			const catalogItem = supplierOrg.catalogModule.items.find(
				(catalogItem) => catalogItem.id === itemId,
			);

			if (catalogItem) {
				// Use GYD pricing if available, otherwise USD
				const price = catalogItem.price.GYD ?? catalogItem.price.USD ?? 0;

				suppliers.push({
					name: supplierOrg.org.name,
					price: price,
					org: supplierOrg,
				});
			}
		}
	});

	// Sort by price (lowest first)
	return suppliers.sort((a, b) => a.price - b.price);
}

export function useProgramSupplies(
	program: Program,
	orgInstance?: OrgInstance,
) {
	const [selectedSuppliers, setSelectedSuppliers] = useState<
		Record<string, string>
	>({});
	const [initialized, setInitialized] = useState(false);
	const [supplierData, setSupplierData] = useState<Record<string, Supplier[]>>(
		{},
	);

	// Process requirements (filter invalid items, handle fallback to standardProgramVersion)
	const requirements = useMemo(() => {
		const rawRequirements =
			program.requirements ??
			program.standardProgramVersion?.requirements ??
			[];

		// Filter out items that don't exist in the items database
		return rawRequirements
			.map((requirement) => ({
				...requirement,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/prefer-optional-chain
				items: requirement.items.filter((item) => item.item && item.item.id),
			}))
			.filter((requirement) => requirement.items.length > 0);
	}, [program.requirements, program.standardProgramVersion?.requirements]);

	// Flatten all items from all requirements
	const allItems = useMemo(() => {
		const items: SuppliesItem[] = [];

		requirements.forEach((requirement: RequirementList) => {
			// Filter out items that don't have valid item data (runtime data may not match types)
			const validItems = requirement.items.filter(
				(entry) => (entry as { item?: { name?: string } }).item?.name,
			) as RequirementListEntry[];
			items.push(...validItems);
		});

		return items;
	}, [requirements]);

	// Initialize supplier data from recommended suppliers
	useEffect(() => {
		if (!initialized && requirements.length > 0 && orgInstance) {
			const initialSelections: Record<string, string> = {};
			const supplierDataMap: Record<string, Supplier[]> = {};

			// Get recommended suppliers from the organization
			const recommendedSuppliers =
				orgInstance.org.supplierRecommendations
					?.map((rec) => {
						// Find the full OrgInstance for each supplier
						const fullSupplierOrg = ORGS.find(
							(org) => org.org.username === rec.org.username,
						);
						return fullSupplierOrg;
					})
					.filter((org): org is OrgInstance => org !== undefined) ?? [];

			requirements.forEach((requirement, reqIndex) => {
				requirement.items.forEach((item, itemIndex) => {
					const itemKey = `${reqIndex}-${itemIndex}`;
					const suppliers = getSupplierDataForItem(
						item.item.id,
						recommendedSuppliers,
					);

					// Store the supplier data for this item
					supplierDataMap[itemKey] = suppliers;

					// Select the cheapest supplier (first one since they're sorted by price)
					// If there's only one supplier, select it; if multiple, select the cheapest
					if (suppliers.length > 0) {
						initialSelections[itemKey] = suppliers[0]?.name ?? "";
					} else {
						initialSelections[itemKey] = "";
					}
				});
			});

			setSupplierData(supplierDataMap);
			setSelectedSuppliers(initialSelections);
			setInitialized(true);
		}
	}, [requirements, initialized, orgInstance]);

	// Calculate totals
	const totals = useMemo(() => {
		let totalPrice = 0;
		let supplierCount = 0;
		const uniqueSuppliers = new Set<string>();

		requirements.forEach((requirement, reqIndex) => {
			requirement.items.forEach((item, itemIndex) => {
				const itemKey = `${reqIndex}-${itemIndex}`;
				const selectedSupplier = selectedSuppliers[itemKey];
				if (selectedSupplier) {
					// Use stored supplier data
					const suppliers = supplierData[itemKey] ?? [];
					const supplier = suppliers.find((s) => s.name === selectedSupplier);
					if (supplier) {
						totalPrice += supplier.price * (item.quantity ?? 1);
						uniqueSuppliers.add(selectedSupplier);
					}
				}
			});
		});

		supplierCount = uniqueSuppliers.size;
		return { totalPrice, supplierCount };
	}, [requirements, selectedSuppliers, supplierData]);

	return {
		requirements,
		allItems,
		supplierData,
		selectedSuppliers,
		setSelectedSuppliers,
		totals,
		initialized,
	};
}

