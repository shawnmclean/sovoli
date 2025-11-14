"use server";

import { env } from "~/env";
import type { ReliefFormData } from "./components/ReliefForm";
import { findItemById } from "~/modules/data/items";
import {
  CONTACT_ROLE_OPTIONS,
  ORG_TYPE_OPTIONS,
  PARISH_OPTIONS,
  SEVERITY_OPTIONS,
} from "./components/options";

const AIRTABLE_BASE_ID = "appmYWD3Zt106eYfY";
const AIRTABLE_TABLE_ID = "tbloHJD4xzvsh9UdH";

export async function submitReliefForm(formData: ReliefFormData) {
  const loggableFormData = {
    ...formData,
    photos: formData.photos,
  };

  console.log(
    "Needs Intake Submission:",
    JSON.stringify(loggableFormData, null, 2),
  );

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
    const parishValue =
      parishLabel && parishLabel.trim().length > 0 ? parishLabel : undefined;
    const severityLabel =
      SEVERITY_OPTIONS.find((option) => option.key === formData.severity)
        ?.label ?? formData.severity;
    const severityValue =
      severityLabel && severityLabel.trim().length > 0
        ? severityLabel
        : undefined;

    const combinedPhone =
      formData.contactPhone && formData.contactPhone.trim().length > 0
        ? formData.contactPhone
        : [formData.contactDialCode, formData.contactPhoneRaw]
            .filter((value) => value && value.trim().length > 0)
            .join(" ");

    const successfulPhotos = formData.photos.filter(
      (photo) => photo.url && photo.publicId,
    );

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
      "Location Parish"?: string;
      "Supplies Names"?: string;
      "Supplies Summary"?: string;
      "Supplies Other"?: string;
      "Project Severity"?: string;
      "Project Description"?: string;
      "Organisation Username"?: string;
      Notes?: string;
      Photos?: string;
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
      "Location Parish": parishValue,
      "Project Severity": severityValue,
      "Project Description":
        formData.damageDescription.trim().length > 0
          ? formData.damageDescription
          : undefined,
      "Organisation Username":
        formData.schoolUsername.trim().length > 0
          ? formData.schoolUsername
          : undefined,
      "Supplies Names":
        suppliesSelectedNames.length > 0
          ? suppliesSelectedNames.join("\n")
          : undefined,
      "Supplies Summary":
        suppliesItemsData.length > 0 ? suppliesItemsData.join("\n") : undefined,
      "Supplies Other": formData.suppliesOther.trim().length
        ? formData.suppliesOther
        : undefined,
    };

    if (successfulPhotos.length > 0) {
      const photosPayload = successfulPhotos.map((photo) => ({
        url: photo.url,
        publicId: photo.publicId,
        assetId: photo.assetId,
        bucket: photo.bucket,
        uploadedAt: photo.uploadedAt,
        bytes: photo.bytes,
        width: photo.width,
        height: photo.height,
        format: photo.format,
        version: photo.version,
        caption: photo.caption,
        alt: photo.alt,
        category: photo.category,
      }));

      if (photosPayload.length > 0) {
        fields.Photos = JSON.stringify(photosPayload, null, 2);
      }
    }

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
