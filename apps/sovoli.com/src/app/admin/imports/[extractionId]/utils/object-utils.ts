/**
 * Get a value from a nested object using a path like "locations[0].address.line1"
 */
export function getNestedValue(
	obj: Record<string, unknown>,
	path: string,
): unknown {
	const parts = path.split(/[.[\]]/).filter(Boolean);
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

/**
 * Set a value in a nested object using a path like "locations[0].address.line1"
 */
export function setNestedValue(
	obj: Record<string, unknown>,
	path: string,
	value: unknown,
): void {
	const parts = path.split(/[.[\]]/).filter(Boolean);
	let current: Record<string, unknown> = obj;

	for (let i = 0; i < parts.length - 1; i++) {
		const part = parts[i];
		if (!part) continue;
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

	const lastPart = parts[parts.length - 1];
	if (!lastPart) return;
	current[lastPart] = value;
}
