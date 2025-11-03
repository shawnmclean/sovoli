import type { Contact, SocialLink } from "~/modules/core/types";
import type { OrgInstance } from "~/modules/organisations/types";
import {
  PRIVATE_SCHOOL_GUYANA_METADATA,
  type PrivateSchoolMetadata,
} from "./metadata.generated";

const normalizePhoneForComparison = (value: string): string =>
  value.replace(/[^+\d]/g, "");

const ensurePrimaryPhone = (phones: Contact[]): Contact[] => {
  if (phones.length === 0) {
    return phones;
  }

  if (phones.some((contact) => contact.primary)) {
    return phones;
  }

  const [first, ...rest] = phones;

  return [{ ...first, primary: true }, ...rest];
};

const upsertPhoneContacts = (
  contacts: Contact[] | undefined,
  phoneNumbers: string[],
): Contact[] => {
  if (!phoneNumbers.length) {
    return contacts ?? [];
  }

  const existingContacts = contacts ? [...contacts] : [];
  const phoneContacts = existingContacts.filter((contact) => contact.type === "phone");
  const otherContacts = existingContacts.filter((contact) => contact.type !== "phone");

  const seenNumbers = new Set<string>(
    phoneContacts.map((contact) => normalizePhoneForComparison(contact.value)),
  );

  const newPhoneContacts: Contact[] = [];

  for (const value of phoneNumbers) {
    const normalized = normalizePhoneForComparison(value);
    if (!normalized || seenNumbers.has(normalized)) {
      continue;
    }

    seenNumbers.add(normalized);
    newPhoneContacts.push({
      type: "phone",
      value,
      isPublic: true,
    });
  }

  const mergedPhoneContacts = ensurePrimaryPhone([...phoneContacts, ...newPhoneContacts]);

  return [...otherContacts, ...mergedPhoneContacts];
};

const normalizeUrl = (url: string): string => url.replace(/\/?$/, "").toLowerCase();

const inferPlatform = (url: string): SocialLink["platform"] => {
  const normalized = url.toLowerCase();

  if (normalized.includes("facebook.com")) {
    return "facebook";
  }

  if (normalized.includes("instagram.com")) {
    return "instagram";
  }

  if (normalized.includes("youtube.com") || normalized.includes("youtu.be")) {
    return "youtube";
  }

  if (normalized.includes("x.com") || normalized.includes("twitter.com")) {
    return "x";
  }

  if (normalized.includes("linkedin.com")) {
    return "other";
  }

  return "other";
};

const mergeSocialLinks = (
  links: SocialLink[] | undefined,
  metadata: PrivateSchoolMetadata,
): SocialLink[] | undefined => {
  const existingLinks = links ? [...links] : [];

  const filtered = existingLinks.filter((link) => {
    if (metadata.facebook?.url && link.platform === "facebook") {
      return false;
    }

    if (metadata.website && link.platform === "website") {
      return false;
    }

    return true;
  });

  const additions: SocialLink[] = [];

  if (metadata.website) {
    additions.push({ platform: "website", url: metadata.website });
  }

  if (metadata.facebook?.url) {
    additions.push({
      platform: "facebook",
      url: metadata.facebook.url,
      label: metadata.facebook.lastUpdated
        ? `Last updated ${metadata.facebook.lastUpdated}`
        : undefined,
    });
  }

  if (metadata.otherSources) {
    for (const sourceUrl of metadata.otherSources) {
      additions.push({
        platform: inferPlatform(sourceUrl),
        url: sourceUrl,
      });
    }
  }

  if (additions.length === 0 && filtered.length === 0) {
    return undefined;
  }

  const combined = [...filtered, ...additions];
  const deduped: SocialLink[] = [];
  const seen = new Set<string>();

  for (const link of combined) {
    const key = `${link.platform}:${normalizeUrl(link.url)}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(link);
  }

  return deduped;
};

const applyMetadataToLocation = (
  contacts: Contact[] | undefined,
  metadata: PrivateSchoolMetadata,
  existingAddress: OrgInstance["org"]["locations"][number]["address"],
) => {
  const address = { ...existingAddress };

  if (!address.countryCode) {
    address.countryCode = "GY";
  }

  if (metadata.address) {
    if (!address.line1) {
      address.line1 = metadata.address;
    } else if (!address.landmark) {
      address.landmark = metadata.address;
    }
  }

  return {
    address,
    contacts: upsertPhoneContacts(contacts, metadata.phones),
  };
};

export const applyPrivateSchoolMetadata = (instance: OrgInstance): OrgInstance => {
  const metadata = PRIVATE_SCHOOL_GUYANA_METADATA[instance.org.username];

  if (!metadata) {
    return instance;
  }

  const org = { ...instance.org };

  const locations = org.locations.length
    ? org.locations.map((location) => ({ ...location, address: { ...location.address } }))
    : [
        {
          key: "main",
          address: { countryCode: "GY" },
          contacts: [],
          isPrimary: true,
        },
      ];

  const primaryIndex = locations.findIndex((location) => location.isPrimary);
  const targetIndex = primaryIndex >= 0 ? primaryIndex : 0;
  const targetLocation = locations[targetIndex];

  const { address, contacts } = applyMetadataToLocation(
    targetLocation.contacts,
    metadata,
    targetLocation.address,
  );

  const updatedLocation = {
    ...targetLocation,
    address,
    contacts,
    placeId: metadata.placeId ?? targetLocation.placeId,
  };

  locations[targetIndex] = updatedLocation;

  org.locations = locations;
  org.socialLinks = mergeSocialLinks(org.socialLinks, metadata);

  return {
    ...instance,
    org,
  };
};

export const PRIVATE_SCHOOL_METADATA_MAP = PRIVATE_SCHOOL_GUYANA_METADATA;
