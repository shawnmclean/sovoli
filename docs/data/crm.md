# CRM Data Location Guide

This document explains how to locate verification data, documents, and internal CRM information for each tenant (organization) in the system.

## File Structure

Each tenant's data is stored in a dedicated directory following this structure:

```
apps/sovoli.com/src/modules/data/organisations/
├── {category}/
│   ├── {country}/
│   │   ├── {region?}/          # Optional region/state
│   │   │   ├── {tenant-name}/
│   │   │   │   ├── index.ts    # Main tenant data file (parses JSON)
│   │   │   │   ├── org.json    # Organization data
│   │   │   │   ├── cycles.json # Academic/program cycles
│   │   │   │   ├── program-groups.json # Program groups
│   │   │   │   └── {program-group}-academic.json # Academic programs
```

**Note**: All organization data is stored in JSON format. The `index.ts` file imports and parses these JSON files using parser utilities.

### Example Paths

- **Private School in Guyana**: `apps/sovoli.com/src/modules/data/organisations/private-schools/guyana/modernacademy/index.ts`
- **Public School in Jamaica**: `apps/sovoli.com/src/modules/data/organisations/public-schools/jamaica/st-elizabeth/balaclavahighjm/index.ts`
- **Private Kindergarten in Jamaica**: `apps/sovoli.com/src/modules/data/organisations/private-schools/jamaica/st-elizabeth/littlefishkindergarten/index.ts`
- **Hardware Store**: `apps/sovoli.com/src/modules/data/organisations/hardware/jamaica/mongolsbuildersdepot/index.ts`

## Data Structure

Each tenant's `index.ts` file exports an `OrgInstance` object with the following structure:

```typescript
export const TENANT_NAME_ORG: OrgInstance = {
  org: {
    // Core organization data
    username: string,
    name: string,
    logo?: string,
    categories: string[],
    
    // ⭐ VERIFICATION DATA
    verification?: {
      status: "pending" | "verified" | "rejected",
      submittedAt: string,
      submittedBy: string,
      verifiedAt?: string,
      rejectedReason?: string,
      incorporationDate?: string,
      notes?: string,
      
      // ⭐ DOCUMENTS ARRAY
      documents: [
        {
          type: "business_registration" | "tax_id" | "operating_license" | "other",
          name: string,
          url?: string,              // Link to document (e.g., Google Photos, cloud storage)
          uploadedAt: string,
          issuedDate?: string,
          expiryDate?: string,
          referenceNumber?: string,  // Certificate/registration number
          issuingAuthority?: string,  // e.g., "Office of Registrar of Business Names"
          issuingJurisdiction?: {
            country: string,         // ISO code (e.g., "GY", "JM")
            stateOrProvince?: string,
            cityOrRegion?: string,
          },
          notes?: string,
        }
      ],
    },
    isVerified?: boolean,
    
    // ⭐ INTERNAL CRM DATA
    internalCRM?: {
      claimStatus: "unclaimed" | "pending" | "claimed",
      claimedBy?: string,            // Name of person who claimed
      claimedAt?: string,            // Date when claimed (YYYY-MM-DD)
      
      // ⭐ PEOPLE CONTACTS
      people: [
        {
          name: string,
          contacts: [
            {
              type: "email" | "phone" | "whatsapp" | "other",
              value: string,
              label?: string,
              isPublic?: boolean,
              primary?: boolean,
            }
          ],
          notes?: string,
        }
      ],
    },
    
    // Other fields...
    locations: [...],
    socialLinks: [...],
    media: [...],
  },
  // Module data...
};
```

## How to Find Data for a Specific Tenant

### Step 1: Locate the Tenant's Directory

1. Navigate to `apps/sovoli.com/src/modules/data/organisations/`
2. Find the category folder (e.g., `private-schools`, `public-schools`, `hardware`)
3. Navigate to the country folder (e.g., `guyana`, `jamaica`)
4. If applicable, navigate to the region/state folder (e.g., `st-elizabeth`, `st-james`)
5. Find the tenant's folder (usually matches their username or a slugified version of their name)
6. Open the `org.json` file for organization data, or `index.ts` to see how JSON files are parsed

### Step 2: Access Verification Data

In the `org.json` file, look for the `verification` object within the root object:

```json
{
  "verification": {
    "status": "verified",
    "submittedBy": "Nessa",
    "submittedAt": "2025-05-24",
    "incorporationDate": "2020-02-28",
    "notes": "Went to location and saw the original registration.",
    "documents": []
  }
}
```

**Key Fields:**
- `status`: Current verification state
- `submittedBy`: Person who submitted the verification request
- `submittedAt`: Submission date (YYYY-MM-DD format)
- `verifiedAt`: When verification was completed (if verified)
- `rejectedReason`: Reason for rejection (if rejected)
- `incorporationDate`: Official business registration date
- `notes`: Additional notes about the verification process

### Step 3: Access Documents

Documents are stored in the `verification.documents` array in `org.json`:

```json
{
  "verification": {
    "documents": [
      {
        "type": "business_registration",
        "name": "Modern Academy Certificate of Registration 2020",
        "url": "https://photos.app.goo.gl/LBvL5xQ2gT4ssU3Y8",
        "uploadedAt": "2025-05-24",
        "issuedDate": "2020-02-28",
        "expiryDate": "2021-02-25",
        "referenceNumber": "178271",
        "issuingAuthority": "Office of Registrar of Business Names",
        "issuingJurisdiction": {
          "country": "GY"
        },
        "notes": "Captured by photo (in google photos)"
      }
    ]
  }
}
```

**Key Fields:**
- `type`: Document type (business_registration, tax_id, operating_license, other)
- `name`: Descriptive name of the document
- `url`: Link to the document (often Google Photos, cloud storage, or file system path)
- `uploadedAt`: When the document was uploaded
- `issuedDate`: Date the document was issued
- `expiryDate`: When the document expires (if applicable)
- `referenceNumber`: Official reference/certificate number
- `issuingAuthority`: Government or organization that issued it
- `issuingJurisdiction`: Geographic jurisdiction (country, state, city)
- `notes`: Additional context about the document

### Step 4: Access Internal CRM Data

Internal CRM data is stored in the `internalCRM` object in `org.json`:

```json
{
  "internalCRM": {
    "claimStatus": "claimed",
    "claimedBy": "Joel",
    "claimedAt": "2025-05-20",
    "people": []
  }
}
```

**Key Fields:**
- `claimStatus`: `"unclaimed"`, `"pending"`, or `"claimed"`
- `claimedBy`: Name of the person who claimed the organization
- `claimedAt`: Date when the organization was claimed (YYYY-MM-DD format)
- `people`: Array of people associated with the organization (see below)

### Step 5: Access People/Contacts

People and their contact information are in `internalCRM.people` in `org.json`:

```json
{
  "internalCRM": {
    "people": [
      {
        "name": "Joel",
        "contacts": [
          {
            "type": "whatsapp",
            "value": "+592 627-1915",
            "label": "Joel",
            "isPublic": true
          },
          {
            "type": "email",
            "value": "joel@example.com",
            "isPublic": false
          }
        ],
        "notes": "Primary contact person"
      }
    ]
  }
}
```

**Key Fields:**
- `name`: Person's name
- `contacts`: Array of contact methods
  - `type`: Contact type (email, phone, whatsapp, other)
  - `value`: Contact value (phone number, email address, etc.)
  - `label`: Optional label for the contact
  - `isPublic`: Whether this contact is publicly visible
  - `primary`: Whether this is the primary contact method
- `notes`: Additional notes about the person

## Quick Reference: Common Locations

All paths below refer to fields in `org.json`:

### Verification Status
- **Path**: `verification.status`
- **Values**: `"pending"`, `"verified"`, `"rejected"`

### Document URLs
- **Path**: `verification.documents[].url`
- **Common formats**: Google Photos links, cloud storage URLs, file paths

### Claim Information
- **Path**: `internalCRM.claimStatus`, `internalCRM.claimedBy`, `internalCRM.claimedAt`

### Contact Information
- **Path**: `internalCRM.people[].contacts[]`
- **Also check**: `locations[].contacts[]` for location-specific contacts

### Academic Programs
- **File**: `{program-group}-academic.json` (e.g., `nursery-academic.json`)
- **Cycles**: `cycles.json`
- **Program Groups**: `program-groups.json`

## Examples

### Example 1: Modern Academy (Guyana)
**File**: `apps/sovoli.com/src/modules/data/organisations/private-schools/guyana/modernacademy/index.ts`

- **Verification**: Status is `"verified"`, submitted by "Nessa" on 2025-05-24
- **Documents**: 2 business registration certificates (2020 and 2025) stored in Google Photos
- **Internal CRM**: Claimed by "Joel" on 2025-05-20, status is `"claimed"`
- **People**: Joel with WhatsApp contact +592 627-1915

### Example 2: Bacchus Learning Centre (Guyana)
**File**: `apps/sovoli.com/src/modules/data/organisations/private-schools/guyana/bacchuslearning/index.ts`

- **Verification**: Status is `"pending"`, no documents submitted yet
- **Internal CRM**: Status is `"unclaimed"`, no people assigned

## Notes

- All dates are in `YYYY-MM-DD` format
- Document URLs may point to external storage (Google Photos, cloud storage, etc.)
- Some tenants may have incomplete data (empty arrays, missing fields)
- The `isVerified` boolean field should match the `verification.status` field
- Location-specific contacts are separate from `internalCRM.people` contacts

