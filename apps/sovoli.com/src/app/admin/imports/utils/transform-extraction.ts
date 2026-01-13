import type {
	LeadExtractionDocument,
	ProgramEvidence,
	PhoneEvidence,
	EmailEvidence,
	SocialLinkEvidence,
} from "../types/lead-extraction-schema";

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
		contacts: [] as Array<{
			type: "phone" | "whatsapp" | "email";
			value: string;
			isPublic?: boolean;
			primary?: boolean;
		}>,
	}));
}

/**
 * Transform extraction data to org.json format
 * Returns structured data for UI consumption
 */
export function transformExtractionToOrgData(
	extraction: LeadExtractionDocument,
) {
	const businessName =
		extraction.business && extraction.business.length > 0
			? extraction.business[0]!
			: "Unknown Business";

	const orgData: Record<string, unknown> = {
		name: businessName,
	};

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
		if (
			extraction.extraction.locations &&
			extraction.extraction.locations.length > 0
		) {
			const locations = transformLocationsToOrgFormat(
				extraction.extraction.locations,
			);
			// Add contacts to first location
			if (locations.length > 0) {
				locations[0]!.contacts = contacts;
			}
			orgData.locations = locations;
		} else {
			// Create default location with contacts
			orgData.locations = [
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
	} else if (
		extraction.extraction.locations &&
		extraction.extraction.locations.length > 0
	) {
		// Just locations, no contacts
		orgData.locations = transformLocationsToOrgFormat(
			extraction.extraction.locations,
		);
	}

	// Transform social links
	if (extraction.extraction.socialLinks.length > 0) {
		orgData.socialLinks = transformSocialLinksToOrgFormat(
			extraction.extraction.socialLinks,
		);
	}

	return orgData;
}

/**
 * Transform program evidence to program JSON format
 * Returns structured data for UI consumption
 */
export function transformExtractionToProgramData(
	programEvidence: ProgramEvidence,
) {
	const programData: Record<string, unknown> = {};

	// Basic fields
	if (programEvidence.name) {
		programData.name = programEvidence.name;
	}

	if (programEvidence.quickFacts && programEvidence.quickFacts.length > 0) {
		programData.quickFacts = programEvidence.quickFacts;
	}

	if (
		programEvidence.whatYouWillLearn &&
		programEvidence.whatYouWillLearn.length > 0
	) {
		programData.whatYouWillLearn = programEvidence.whatYouWillLearn;
	}

	// Pricing and schedule will be handled separately as they relate to cycles
	// Store them in a temporary field for now
	if (programEvidence.pricing) {
		programData._extractedPricing = programEvidence.pricing;
	}

	if (programEvidence.schedule) {
		programData._extractedSchedule = programEvidence.schedule;
	}

	if (programEvidence.location) {
		programData._extractedLocation = programEvidence.location;
	}

	return programData;
}
