"use server";

import { env } from "~/env";
import type { ReliefFormData } from "./components/ReliefForm";
import { findItemById } from "~/modules/data/items";
import {
  CONTACT_ROLE_OPTIONS,
  ORG_TYPE_OPTIONS,
  PARISH_OPTIONS,
} from "./components/options";

const AIRTABLE_BASE_ID = "appmYWD3Zt106eYfY";
const AIRTABLE_TABLE_ID = "tbloHJD4xzvsh9UdH";

export async function submitReliefForm(formData: ReliefFormData) {
  console.log("Needs Intake Submission:", JSON.stringify(formData, null, 2));

  try {
    const suppliesItemsData = formData.suppliesSelected
      .map((itemId) => {
        const item = findItemById(itemId);
        if (!item) {
          return null;
        }
        const quantity = formData.suppliesQuantities[itemId] ?? 0;
        const quantityLabel = quantity > 0 ? ` (x${quantity})` : "";
        return `${item.name}${quantityLabel}`;
      })
      .filter((value): value is string => value !== null);

    const suppliesSelectedNames = formData.suppliesSelected
      .map((itemId) => {
        const item = findItemById(itemId);
        return item?.name ?? null;
      })
      .filter((value): value is string => value !== null);

    const orgTypeLabel =
      ORG_TYPE_OPTIONS.find((option) => option.key === formData.schoolType)
        ?.label ?? formData.schoolType;
    const contactRoleLabel =
      CONTACT_ROLE_OPTIONS.find((option) => option.key === formData.contactRole)
        ?.label ?? formData.contactRole;
    const parishLabel =
      PARISH_OPTIONS.find((option) => option.key === formData.locationParish)
        ?.label ?? formData.locationParish;

    const combinedPhone =
      formData.contactPhone && formData.contactPhone.trim().length > 0
        ? formData.contactPhone
        : [formData.contactDialCode, formData.contactPhoneRaw]
            .filter((value) => value && value.trim().length > 0)
            .join(" ");

    const fields: {
      "Contact First Name": string;
      "Contact Last Name": string;
      "Contact Phone"?: string;
      "Contact Role"?: string;
      "Organisation Name": string;
      "Organisation Type"?: string;
      "Location Address 1": string;
      "Location Address 2"?: string;
      "Location City": string;
      "Location Parish": string;
      "Supplies Names"?: string;
      "Supplies Summary"?: string;
      "Supplies Other"?: string;
      Notes?: string;
    } = {
      "Contact First Name": formData.contactFirstName,
      "Contact Last Name": formData.contactLastName,
      "Contact Phone": combinedPhone || undefined,
      "Contact Role": contactRoleLabel || undefined,
      "Organisation Name": formData.schoolName,
      "Organisation Type": orgTypeLabel || undefined,
      "Location Address 1": formData.locationAddressLine1,
      "Location Address 2": formData.locationAddressLine2.trim().length
        ? formData.locationAddressLine2
        : undefined,
      "Location City": formData.locationCity,
      "Location Parish": parishLabel,
      "Supplies Names":
        suppliesSelectedNames.length > 0
          ? suppliesSelectedNames.join("\n")
          : undefined,
      "Supplies Summary":
        suppliesItemsData.length > 0 ? suppliesItemsData.join("\n") : undefined,
      "Supplies Other": formData.suppliesOther.trim().length
        ? formData.suppliesOther
        : undefined,
      Notes: formData.notes.trim().length > 0 ? formData.notes : undefined,
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
