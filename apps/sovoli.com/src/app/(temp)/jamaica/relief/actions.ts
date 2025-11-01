"use server";

import { env } from "~/env";
import type { ReliefFormData } from "./components/ReliefForm";
import { SUPPLIES_ITEMS } from "./data/suppliesItems";

const AIRTABLE_BASE_ID = "appmYWD3Zt106eYfY";
const AIRTABLE_TABLE_ID = "tbleTRy42k25VuQhF";

export async function submitReliefForm(formData: ReliefFormData) {
  console.log("Relief Form Submission:", JSON.stringify(formData, null, 2));

  try {
    // Format supplies items data
    const suppliesItemsData: string[] = [];
    const suppliesNotesData: string[] = [];

    if (formData.contributionType === "supplies") {
      Object.entries(formData.suppliesItems).forEach(([itemId, quantity]) => {
        const item = SUPPLIES_ITEMS.find((i) => i.id === itemId);
        if (item && quantity > 0) {
          suppliesItemsData.push(`${item.name}: ${quantity}`);

          // Add notes if available
          const note = formData.suppliesItemNotes[itemId];
          if (note) {
            suppliesNotesData.push(`${item.name}: ${note}`);
          }
        }
      });
    }

    // Prepare fields for Airtable
    const fields: {
      "Submission ID"?: string;
      "Contribution Type"?: string;
      "Labour Availability"?: string;
      "Labour Availability Other"?: string;
      "Financial Amount"?: number;
      "Financial Currency"?: string;
      "Supplies Items"?: string;
      "Supplies Item Notes"?: string;
      "Supplies Other"?: string;
      "Contact Name"?: string;
      "Contact Phone"?: string;
      "Address Line 1"?: string;
      "Address Line 2"?: string;
      "City"?: string;
      "State/Country"?: string;
    } = {
      "Submission ID": crypto.randomUUID(),
      "Contribution Type": formData.contributionType
        ? formData.contributionType.charAt(0).toUpperCase() +
          formData.contributionType.slice(1)
        : undefined,
      "Contact Name": formData.name,
      "Contact Phone": formData.phone,
      "Address Line 1": formData.addressLine1,
      "Address Line 2": formData.addressLine2 || undefined,
      "City": formData.city,
      "State/Country": formData.stateCountry,
    };

    // Add contribution-specific fields
    if (formData.contributionType === "labour") {
      fields["Labour Availability"] =
        formData.labourAvailability === "now"
          ? "Available Now"
          : formData.labourAvailability === "end-of-nov"
            ? "End of November"
            : formData.labourAvailability === "other"
              ? "Other"
              : undefined;
      fields["Labour Availability Other"] =
        formData.labourAvailabilityOther || undefined;
    } else if (formData.contributionType === "financial") {
      fields["Financial Amount"] =
        parseFloat(formData.financialAmount) || undefined;
      fields["Financial Currency"] = formData.financialCurrency;
    } else if (formData.contributionType === "supplies") {
      fields["Supplies Items"] =
        suppliesItemsData.length > 0 ? suppliesItemsData.join("\n") : undefined;
      fields["Supplies Item Notes"] =
        suppliesNotesData.length > 0 ? suppliesNotesData.join("\n") : undefined;
      fields["Supplies Other"] = formData.suppliesOther || undefined;
    }

    // Write to Airtable
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
      throw new Error(`Failed to submit to Airtable: ${response.statusText}`);
    }

    console.log("Successfully submitted to Airtable");
    return { success: true };
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
}
