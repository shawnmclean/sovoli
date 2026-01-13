/**
 * Diff entry for a single field
 */
export interface DiffEntry {
	field: string;
	oldValue: unknown;
	newValue: unknown;
	type: "add" | "update" | "remove";
}

/**
 * Compute diff between old and new data
 * Flattens nested structures and arrays to show individual fields
 * Returns array of diff entries
 */
export function computeDiff(
	oldData: Record<string, unknown>,
	newData: Record<string, unknown>,
	prefix = "",
): DiffEntry[] {
	const diffs: DiffEntry[] = [];

	// Check all keys in new data
	for (const key in newData) {
		if (Object.prototype.hasOwnProperty.call(newData, key)) {
			// Skip metadata fields
			if (key.startsWith("_")) {
				continue;
			}

			const fieldPath = prefix ? `${prefix}.${key}` : key;
			const oldValue = oldData[key];
			const newValue = newData[key];

			// If key doesn't exist in old data, it's new
			if (!(key in oldData)) {
				// Flatten the new value if it's an object or array
				if (Array.isArray(newValue)) {
					// Flatten array - show each element's fields
					for (let i = 0; i < newValue.length; i++) {
						const item = newValue[i];
						if (typeof item === "object" && item !== null && !Array.isArray(item)) {
							// Recursively flatten object items in array
							const nestedDiffs = computeDiff(
								{} as Record<string, unknown>,
								item as Record<string, unknown>,
								`${fieldPath}[${i}]`,
							);
							diffs.push(...nestedDiffs);
						} else {
							// Simple array item
							diffs.push({
								field: `${fieldPath}[${i}]`,
								oldValue: undefined,
								newValue: item,
								type: "add",
							});
						}
					}
				} else if (
					typeof newValue === "object" &&
					newValue !== null &&
					!Array.isArray(newValue)
				) {
					// Recursively flatten nested objects
					const nestedDiffs = computeDiff(
						{} as Record<string, unknown>,
						newValue as Record<string, unknown>,
						fieldPath,
					);
					diffs.push(...nestedDiffs);
				} else {
					// Simple value
					diffs.push({
						field: fieldPath,
						oldValue: undefined,
						newValue,
						type: "add",
					});
				}
				continue;
			}

			// Compare values
			if (Array.isArray(newValue) && Array.isArray(oldValue)) {
				// For arrays, compare each element
				const maxLength = Math.max(newValue.length, oldValue.length);
				for (let i = 0; i < maxLength; i++) {
					const newItem = newValue[i];
					const oldItem = oldValue[i];

					if (i >= oldValue.length) {
						// New item added
						if (typeof newItem === "object" && newItem !== null && !Array.isArray(newItem)) {
							const nestedDiffs = computeDiff(
								{} as Record<string, unknown>,
								newItem as Record<string, unknown>,
								`${fieldPath}[${i}]`,
							);
							diffs.push(...nestedDiffs);
						} else {
							diffs.push({
								field: `${fieldPath}[${i}]`,
								oldValue: undefined,
								newValue: newItem,
								type: "add",
							});
						}
					} else if (i >= newValue.length) {
						// Item removed - skip (we don't show removes)
						continue;
					} else if (
						typeof newItem === "object" &&
						newItem !== null &&
						!Array.isArray(newItem) &&
						typeof oldItem === "object" &&
						oldItem !== null &&
						!Array.isArray(oldItem)
					) {
						// Both are objects - recursively compare
						const nestedDiffs = computeDiff(
							oldItem as Record<string, unknown>,
							newItem as Record<string, unknown>,
							`${fieldPath}[${i}]`,
						);
						diffs.push(...nestedDiffs);
					} else if (newItem !== oldItem) {
						// Simple value changed
						diffs.push({
							field: `${fieldPath}[${i}]`,
							oldValue: oldItem,
							newValue: newItem,
							type: "update",
						});
					}
				}
			} else if (
				typeof newValue === "object" &&
				newValue !== null &&
				typeof oldValue === "object" &&
				oldValue !== null &&
				!Array.isArray(newValue) &&
				!Array.isArray(oldValue)
			) {
				// Recursively check nested objects
				const nestedDiffs = computeDiff(
					oldValue as Record<string, unknown>,
					newValue as Record<string, unknown>,
					fieldPath,
				);
				diffs.push(...nestedDiffs);
			} else if (oldValue !== newValue) {
				diffs.push({
					field: fieldPath,
					oldValue,
					newValue,
					type: "update",
				});
			}
		}
	}

	// Don't include removed keys - we only care about adds and updates
	return diffs.filter((diff) => diff.type !== "remove");
}

/**
 * Check if two values are deeply equal
 */
export function deepEqual(a: unknown, b: unknown): boolean {
	if (a === b) {
		return true;
	}

	if (
		typeof a !== "object" ||
		a === null ||
		typeof b !== "object" ||
		b === null
	) {
		return false;
	}

	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) {
			return false;
		}
		for (let i = 0; i < a.length; i++) {
			if (!deepEqual(a[i], b[i])) {
				return false;
			}
		}
		return true;
	}

	const keysA = Object.keys(a);
	const keysB = Object.keys(b);

	if (keysA.length !== keysB.length) {
		return false;
	}

	for (const key of keysA) {
		if (!keysB.includes(key)) {
			return false;
		}
		if (!deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
			return false;
		}
	}

	return true;
}
