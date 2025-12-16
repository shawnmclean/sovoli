"use server";

import { env } from "~/env";

const AIRTABLE_BASE_ID = "appmYWD3Zt106eYfY";
// Note: This table ID needs to be created in Airtable
// Table name: business-leads
// TODO: Replace with actual table ID after creating the table in Airtable
const AIRTABLE_TABLE_ID = "tblBusinessLeads"; // This will need to be updated with actual table ID

export interface BusinessLeadData {
	businessName: string;
	category: string;
	phone: string;
	firstName: string;
	lastName: string;
}

export interface SubmitBusinessLeadResult {
	success: boolean;
	error?: string;
}

export async function submitBusinessLead(
	data: BusinessLeadData,
): Promise<SubmitBusinessLeadResult> {
	console.log("Business Lead Submission:", JSON.stringify(data, null, 2));

	try {
		const fields: {
			"Business Name": string;
			Category: string;
			"Phone Number": string;
			"Contact First Name": string;
			"Contact Last Name": string;
			"Submitted At"?: string;
		} = {
			"Business Name": data.businessName.trim(),
			Category: data.category,
			"Phone Number": data.phone.trim(),
			"Contact First Name": data.firstName.trim(),
			"Contact Last Name": data.lastName.trim(),
			"Submitted At": new Date().toISOString(),
		};

		const response = await fetch(
			`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${env.AIRTABLE_API_KEY}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					fields,
				}),
			},
		);

		if (!response.ok) {
			const errorData = (await response.json().catch(() => ({}))) as Record<
				string,
				unknown
			>;
			console.error("Airtable submission error:", errorData);
			return {
				success: false,
				error: `Failed to submit to Airtable: ${response.statusText}`,
			};
		}

		console.log("Successfully submitted business lead to Airtable");
		return { success: true };
	} catch (error) {
		console.error("Error submitting business lead:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "An unexpected error occurred",
		};
	}
}

