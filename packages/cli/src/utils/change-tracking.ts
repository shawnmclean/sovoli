/**
 * Change tracking metadata for orgs and programs
 */

export interface ChangeMetadata {
	source: string; // Extraction filename
	timestamp: string; // ISO timestamp
	updatedFields: string[]; // Fields that were changed
	isNew: boolean; // Whether this is a new record
}

/**
 * Get current ISO timestamp
 */
export function getCurrentTimestamp(): string {
	return new Date().toISOString();
}

/**
 * Compare two objects and return list of changed field paths
 */
export function getChangedFields(
	oldData: Record<string, unknown>,
	newData: Record<string, unknown>,
	prefix = "",
): string[] {
	const changedFields: string[] = [];

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
				changedFields.push(fieldPath);
				continue;
			}

			// Compare values
			if (Array.isArray(newValue) && Array.isArray(oldValue)) {
				// For arrays, check if they're different
				if (
					JSON.stringify(newValue) !== JSON.stringify(oldValue)
				) {
					changedFields.push(fieldPath);
				}
			} else if (
				typeof newValue === "object" &&
				newValue !== null &&
				typeof oldValue === "object" &&
				oldValue !== null
			) {
				// Recursively check nested objects
				const nestedChanges = getChangedFields(
					oldValue as Record<string, unknown>,
					newValue as Record<string, unknown>,
					fieldPath,
				);
				changedFields.push(...nestedChanges);
			} else if (oldValue !== newValue) {
				changedFields.push(fieldPath);
			}
		}
	}

	return changedFields;
}

/**
 * Create change metadata for a new record
 */
export function createNewRecordMetadata(
	source: string,
): ChangeMetadata {
	return {
		source,
		timestamp: getCurrentTimestamp(),
		updatedFields: [],
		isNew: true,
	};
}

/**
 * Create change metadata for an updated record
 */
export function createUpdateMetadata(
	source: string,
	updatedFields: string[],
): ChangeMetadata {
	return {
		source,
		timestamp: getCurrentTimestamp(),
		updatedFields,
		isNew: false,
	};
}
