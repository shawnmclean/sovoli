"use client";

import { useState, useEffect } from "react";
import type { OrgInstance } from "~/modules/organisations/types";

interface ReceivablesCounterProps {
	orgInstance: OrgInstance;
	totalItems: number;
}

export function ReceivablesCounter({
	orgInstance,
	totalItems,
}: ReceivablesCounterProps) {
	const { org } = orgInstance;

	// Generate a unique storage key for this organization
	const storageKey = `receivables-checked-${org.username}`;

	// Load checked items from localStorage
	const [checkedItems, setCheckedItems] = useState<Set<string>>(() => {
		if (typeof window === "undefined") return new Set();
		try {
			const stored = localStorage.getItem(storageKey);
			if (!stored) return new Set();
			const parsed = JSON.parse(stored) as string[];
			return new Set(parsed);
		} catch {
			return new Set();
		}
	});

	// Listen for storage changes (when items are checked/unchecked)
	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleStorageChange = () => {
			try {
				const stored = localStorage.getItem(storageKey);
				if (!stored) {
					setCheckedItems(new Set());
					return;
				}
				const parsed = JSON.parse(stored) as string[];
				setCheckedItems(new Set(parsed));
			} catch {
				setCheckedItems(new Set());
			}
		};

		// Listen for storage events (from other tabs/windows)
		window.addEventListener("storage", handleStorageChange);

		// Also listen for custom events (from same tab)
		const interval = setInterval(handleStorageChange, 500);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
			clearInterval(interval);
		};
	}, [storageKey]);

	const totalChecked = checkedItems.size;
	const progress = totalItems > 0 ? (totalChecked / totalItems) * 100 : 0;

	return (
		<div className="text-right">
			<div className="text-2xl font-bold">
				{totalChecked} / {totalItems}
			</div>
			<div className="text-sm text-default-500">
				{Math.round(progress)}% complete
			</div>
		</div>
	);
}
