import type { OrgInstance } from "~/modules/organisations/types";

/**
 * Gets the best available WhatsApp contact from an organization's locations.
 * Priority order:
 * 1. Primary WhatsApp contact from primary location
 * 2. First WhatsApp contact from any location
 * 3. undefined if no WhatsApp contacts found
 */
export function getWhatsAppContact(
  orgInstance: OrgInstance,
): string | undefined {
  // First try to find primary WhatsApp contact from primary location
  const primaryLocation = orgInstance.org.locations.find((l) => l.isPrimary);
  if (primaryLocation) {
    const primaryWhatsapp = primaryLocation.contacts.find(
      (c) => c.type === "whatsapp" && c.primary,
    );
    if (primaryWhatsapp) {
      return primaryWhatsapp.value;
    }
  }

  // If no primary WhatsApp found, get the first WhatsApp contact from any location
  for (const location of orgInstance.org.locations) {
    const whatsappContact = location.contacts.find(
      (c) => c.type === "whatsapp",
    );
    if (whatsappContact) {
      return whatsappContact.value;
    }
  }

  return undefined;
}
