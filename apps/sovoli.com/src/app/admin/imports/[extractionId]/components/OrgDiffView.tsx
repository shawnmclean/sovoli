"use client";

import { useState, useEffect } from "react";
import { Card } from "@sovoli/ui/components/card";
import { computeDiff } from "../../utils/diff-compute";
import { DiffField } from "./DiffField";

interface OrgDiffViewProps {
	oldOrg: Record<string, unknown> | null;
	newOrg: Record<string, unknown>;
	onChange: (updatedOrg: Record<string, unknown>) => void;
}

/**
 * Set a value in a nested object using a path like "locations[0].address.line1"
 */
function setNestedValue(
	obj: Record<string, unknown>,
	path: string,
	value: unknown,
): void {
	const parts = path.split(/[\.\[\]]/).filter(Boolean);
	let current: Record<string, unknown> = obj;

	for (let i = 0; i < parts.length - 1; i++) {
		const part = parts[i]!;
		const nextPart = parts[i + 1];
		const isArrayIndex = nextPart && !Number.isNaN(Number(nextPart));

		if (isArrayIndex) {
			// Current part is array name, next part is index
			const index = Number(nextPart);
			if (!Array.isArray(current[part])) {
				current[part] = [];
			}
			const arr = current[part] as unknown[];
			// Ensure array is large enough
			while (arr.length <= index) {
				arr.push({});
			}
			if (typeof arr[index] !== "object" || arr[index] === null || Array.isArray(arr[index])) {
				arr[index] = {};
			}
			current = arr[index] as Record<string, unknown>;
			i++; // Skip the index part
		} else {
			if (!(part in current) || typeof current[part] !== "object" || current[part] === null || Array.isArray(current[part])) {
				current[part] = {};
			}
			current = current[part] as Record<string, unknown>;
		}
	}

	const lastPart = parts[parts.length - 1]!;
	current[lastPart] = value;
}

/**
 * Get a value from a nested object using a path like "locations[0].address.line1"
 */
function getNestedValue(
	obj: Record<string, unknown>,
	path: string,
): unknown {
	const parts = path.split(/[\.\[\]]/).filter(Boolean);
	let current: unknown = obj;

	for (const part of parts) {
		if (typeof current !== "object" || current === null) {
			return undefined;
		}

		if (Array.isArray(current)) {
			const index = Number(part);
			if (Number.isNaN(index)) {
				return undefined;
			}
			current = current[index];
		} else {
			current = (current as Record<string, unknown>)[part];
		}
	}

	return current;
}

export function OrgDiffView({ oldOrg, newOrg, onChange }: OrgDiffViewProps) {
	const [editedOrg, setEditedOrg] = useState<Record<string, unknown>>(newOrg);
	const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
	const isNew = oldOrg === null;

	// Compute diffs - this will flatten nested structures
	const diffs = oldOrg ? computeDiff(oldOrg, editedOrg) : [];

	// For new orgs, show all fields as "add" - but we need to flatten them too
	const allDiffs = isNew
		? computeDiff({} as Record<string, unknown>, editedOrg)
		: diffs.filter((diff) => diff.type !== "remove");

	// Initialize selected fields - all selected by default
	useEffect(() => {
		if (selectedFields.size === 0 && allDiffs.length > 0) {
			const initialSelected = new Set(allDiffs.map((diff) => diff.field));
			setSelectedFields(initialSelected);
		}
	}, [allDiffs.length]);

	// Update onChange whenever editedOrg or selectedFields change
	useEffect(() => {
		// Start with old org data if updating, otherwise empty object
		const finalOrg: Record<string, unknown> = oldOrg
			? (JSON.parse(JSON.stringify(oldOrg)) as Record<string, unknown>)
			: {};
		
		// Apply only selected field changes
		for (const diff of allDiffs) {
			if (selectedFields.has(diff.field)) {
				const value = getNestedValue(editedOrg, diff.field);
				setNestedValue(finalOrg, diff.field, value);
			}
		}
		
		onChange(finalOrg);
	}, [editedOrg, selectedFields, allDiffs, oldOrg, onChange]);

	const handleFieldChange = (field: string, value: unknown) => {
		const updated = JSON.parse(JSON.stringify(editedOrg)) as Record<string, unknown>;
		setNestedValue(updated, field, value);
		setEditedOrg(updated);
	};

	const handleFieldSelection = (field: string, selected: boolean) => {
		const newSelected = new Set(selectedFields);
		if (selected) {
			newSelected.add(field);
		} else {
			newSelected.delete(field);
		}
		setSelectedFields(newSelected);
	};

	return (
		<Card className="p-6">
			<div className="mb-4">
				<h2 className="text-xl font-semibold mb-2">
					{isNew ? "New Organization" : "Organization Updates"}
				</h2>
				{isNew ? (
					<p className="text-sm text-muted-foreground">
						This organization will be created from the extraction data. Select which fields to include.
					</p>
				) : (
					<p className="text-sm text-muted-foreground">
						Review and edit the fields that will be updated. Select which fields to include.
					</p>
				)}
			</div>

			<div className="space-y-4">
				{allDiffs.length === 0 ? (
					<p className="text-sm text-muted-foreground">No changes detected.</p>
				) : (
					allDiffs.map((diff) => {
						const value = getNestedValue(editedOrg, diff.field);

						return (
							<DiffField
								key={diff.field}
								diff={diff}
								value={value}
								onChange={(newValue) => handleFieldChange(diff.field, newValue)}
								onSelectedChange={(selected) => handleFieldSelection(diff.field, selected)}
								selected={selectedFields.has(diff.field)}
								action={isNew ? "add" : "update"}
							/>
						);
					})
				)}
			</div>
		</Card>
	);
}
