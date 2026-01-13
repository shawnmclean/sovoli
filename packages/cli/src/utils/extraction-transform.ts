import type {
	LeadExtractionDocument,
	ProgramEvidence,
	PhoneEvidence,
	EmailEvidence,
	SocialLinkEvidence,
} from "../validation/schemas/lead-extraction-schema.js";
import {
	getChangedFields,
	type ChangeMetadata,
} from "./change-tracking.js";

/**
 * Transform extraction contacts to org.json location contacts format
 */
export function transformContactsToOrgFormat(
	phones: PhoneEvidence[],
	emails: EmailEvidence[],
) {
	const contacts: Array<{
		type: "phone" | "whatsapp" | "email";
		value: string;
		isPublic?: boolean;
		primary?: boolean;
	}> = [];

	// Add phones
	for (const phone of phones) {
		contacts.push({
			type: phone.type || "phone",
			value: phone.value,
			isPublic: true,
		});
	}

	// Add emails
	for (const email of emails) {
		contacts.push({
			type: "email",
			value: email.value,
			isPublic: true,
		});
	}

	return contacts;
}

/**
 * Transform extraction social links to org.json format
 */
export function transformSocialLinksToOrgFormat(
	socialLinks: SocialLinkEvidence[],
) {
	return socialLinks.map((link) => ({
		platform: link.platform,
		url: link.url || link.value,
		handle: link.handle,
		label: link.platform === "other" ? link.value : undefined,
	}));
}

/**
 * Transform extraction locations to org.json format
 */
export function transformLocationsToOrgFormat(locations: string[]) {
	return locations.map((locationStr, index) => ({
		key: `location-${index + 1}`,
		label: `Location ${index + 1}`,
		isPrimary: index === 0,
		address: {
			line1: locationStr,
			countryCode: "JM", // Default, should be prompted or inferred
		},
		contacts: [],
	}));
}

/**
 * Transform extraction data to org.json updates
 */
export function transformExtractionToOrgUpdates(
	extraction: LeadExtractionDocument,
) {
	const updates: Record<string, unknown> = {};

	// Transform contacts
	if (
		extraction.extraction.contacts.phones.length > 0 ||
		extraction.extraction.contacts.emails.length > 0
	) {
		const contacts = transformContactsToOrgFormat(
			extraction.extraction.contacts.phones,
			extraction.extraction.contacts.emails,
		);

		// Add to first location or create default location
		if (extraction.extraction.locations && extraction.extraction.locations.length > 0) {
			updates.locations = transformLocationsToOrgFormat(
				extraction.extraction.locations,
			);
			// Add contacts to first location
			if (Array.isArray(updates.locations) && updates.locations.length > 0) {
				const firstLocation = updates.locations[0] as {
					contacts?: unknown[];
				};
				if (firstLocation) {
					firstLocation.contacts = contacts;
				}
			}
		} else {
			// Create default location with contacts
			updates.locations = [
				{
					key: "main-location",
					label: "Main Location",
					isPrimary: true,
					address: {
						countryCode: "JM",
					},
					contacts,
				},
			];
		}
	}

	// Transform social links
	if (extraction.extraction.socialLinks.length > 0) {
		updates.socialLinks = transformSocialLinksToOrgFormat(
			extraction.extraction.socialLinks,
		);
	}

	// Transform locations if not already set
	if (
		extraction.extraction.locations &&
		extraction.extraction.locations.length > 0 &&
		!updates.locations
	) {
		updates.locations = transformLocationsToOrgFormat(
			extraction.extraction.locations,
		);
	}

	return updates;
}

/**
 * Transform program evidence to program JSON format
 */
export function transformExtractionToProgramUpdates(
	programEvidence: ProgramEvidence,
) {
	const updates: Record<string, unknown> = {};

	// Basic fields
	if (programEvidence.name) {
		updates.name = programEvidence.name;
	}

	if (programEvidence.quickFacts && programEvidence.quickFacts.length > 0) {
		updates.quickFacts = programEvidence.quickFacts;
	}

	if (
		programEvidence.whatYouWillLearn &&
		programEvidence.whatYouWillLearn.length > 0
	) {
		// Transform whatYouWillLearn to capabilities format
		// For now, store as simple array - can be enhanced later
		updates.whatYouWillLearn = programEvidence.whatYouWillLearn;
	}

	// Pricing and schedule will be handled separately as they relate to cycles
	// Store them in a temporary field for now
	if (programEvidence.pricing) {
		updates._extractedPricing = programEvidence.pricing;
	}

	if (programEvidence.schedule) {
		updates._extractedSchedule = programEvidence.schedule;
	}

	if (programEvidence.location) {
		updates._extractedLocation = programEvidence.location;
	}

	return updates;
}

/**
 * Track changes between old and new data
 */
export function trackChanges(
	oldData: Record<string, unknown>,
	newData: Record<string, unknown>,
	source: string,
): ChangeMetadata {
	const updatedFields = getChangedFields(oldData, newData);
	const isNew = Object.keys(oldData).length === 0;

	return {
		source,
		timestamp: new Date().toISOString(),
		updatedFields,
		isNew,
	};
}
