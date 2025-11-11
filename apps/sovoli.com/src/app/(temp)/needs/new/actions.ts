"use server";

import { env } from "~/env";
import type { ReliefFormData } from "./components/ReliefForm";
import { SUPPLIES_ITEMS } from "./data/suppliesItems";
import { CONTACT_ROLE_OPTIONS, ORG_TYPE_OPTIONS } from "./components/options";

const AIRTABLE_BASE_ID = "appmYWD3Zt106eYfY";
const AIRTABLE_TABLE_ID = "tbleTRy42k25VuQhF";

export async function submitReliefForm(formData: ReliefFormData) {
  console.log("Needs Intake Submission:", JSON.stringify(formData, null, 2));

  try {
    const suppliesItemsData = formData.suppliesSelected
      .map((itemId) => {
        const item = SUPPLIES_ITEMS.find((entry) => entry.id === itemId);
        return item?.name ?? null;
      })
      .filter((value): value is string => value !== null);

    const contactName = [formData.contactFirstName, formData.contactLastName]
      .filter((value) => value && value.trim().length > 0)
      .join(" ");

    const orgTypeLabel =
      ORG_TYPE_OPTIONS.find((option) => option.key === formData.schoolType)
        ?.label ?? formData.schoolType;
    const contactRoleLabel =
      CONTACT_ROLE_OPTIONS.find((option) => option.key === formData.contactRole)
        ?.label ?? formData.contactRole;

    const fields: {
      "Submission ID"?: string;
      "Contact Name"?: string;
      "Contact Phone"?: string;
      "Contact Phone Raw"?: string;
      "Contact Dial Code"?: string;
      "Contact Country ISO"?: string;
      "Contact Role"?: string;
      "School Name"?: string;
      "School Type"?: string;
      "Location Address 1"?: string;
      "Location Address 2"?: string;
      "Location City / Town"?: string;
      "Location Parish"?: string;
      "Supplies Needed"?: string;
      "Supplies Other"?: string;
      Notes?: string;
    } = {
      "Submission ID": crypto.randomUUID(),
      "Contact Name": contactName || undefined,
      "Contact Phone": formData.contactPhone || undefined,
      "Contact Phone Raw": formData.contactPhoneRaw || undefined,
      "Contact Dial Code": formData.contactDialCode || undefined,
      "Contact Country ISO": formData.contactCountryIso || undefined,
      "Contact Role": contactRoleLabel || undefined,
      "School Name": formData.schoolName,
      "School Type": orgTypeLabel || undefined,
      "Location Address 1": formData.locationAddressLine1,
      "Location Address 2": formData.locationAddressLine2 || undefined,
      "Location City / Town": formData.locationCity,
      "Location Parish": formData.locationParish,
      "Supplies Needed":
        suppliesItemsData.length > 0 ? suppliesItemsData.join("\n") : undefined,
      "Supplies Other": formData.suppliesOther || undefined,
      Notes: formData.notes || undefined,
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
      throw new Error(`Failed to submit to Airtable: ${response.statusText}`);
    }

    console.log("Successfully submitted to Airtable");
    return { success: true };
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
}
