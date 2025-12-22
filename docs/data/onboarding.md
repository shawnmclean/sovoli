# Tenant Onboarding Guide

This guide documents the complete process for onboarding a new tenant (organization) into the Sovoli system. Follow these steps to create all necessary files and integrate the organization into the platform.

## Overview

When onboarding a new tenant, you'll create a directory structure with JSON files that define:
- Organization metadata (name, location, contacts, verification)
- Website configuration
- Media assets (logo, photos)
- Workforce (staff members)
- Academic programs and cycles
- Program groups

**All data is stored in JSON format** - no TypeScript files are needed for tenant data.

## Prerequisites

Before starting, collect the following information:

### Required Information

1. **Organization Details**
   - Full name
   - Username (slugified version of name)
   - Categories (e.g., `["private-school", "nursery-school"]`)
   - Motto (if any)

2. **Location**
   - Full address (line1, line2, city, state, countryCode)
   - Phone number(s)
   - Email address(es)
   - Google Places API placeId (optional, can be fetched via MCP)

3. **Contacts & Social**
   - Phone numbers (with country code)
   - Email addresses
   - Social media links (Instagram, Facebook, etc.)

4. **Internal CRM**
   - Principal/Owner names
   - Key staff contacts
   - Claim status

5. **Verification**
   - Status (pending/verified/rejected)
   - Submission date and by whom
   - Documents (if any)

6. **Media Assets**
   - Logo image (URL or file)
   - Gallery photos (URLs or files)
   - Instagram/Facebook photo URLs work great

7. **Academic Programs** (for schools)
   - Program names and descriptions
   - Age ranges
   - Pricing (currency and amounts)
   - Registration periods
   - Courses/curriculum

8. **Workforce** (for schools)
   - Staff names and roles
   - Departments
   - Positions

## Step-by-Step Process

### Step 1: Determine Directory Structure

The directory path follows this pattern:
```
apps/sovoli.com/src/modules/data/organisations/
├── {category}/
│   ├── {country}/
│   │   ├── {region?}/          # Optional region/state
│   │   │   ├── {tenant-name}/
```

**Example**: `private-schools/jamaica/st-elizabeth/littlefishkindergarten/`

### Step 2: Create Directory

Create the directory structure for the new tenant.

### Step 3: Create `org.json`

Create the core organization data file:

```json
{
  "username": "littlefishkindergarten",
  "name": "Little Fish Kindergarten",
  "logoPhotoId": "lfk-logo",
  "categories": ["private-school", "nursery-school"],
  "locations": [
    {
      "key": "main-location",
      "label": "Main Location",
      "isPrimary": true,
      "address": {
        "line1": "Calabash Bay P.A",
        "line2": "Calabash Bay District",
        "city": "Treasure Beach",
        "state": "St. Elizabeth",
        "countryCode": "JM"
      },
      "contacts": [
        {
          "type": "phone",
          "value": "+18762858079",
          "label": "School",
          "isPublic": true,
          "primary": true
        },
        {
          "type": "email",
          "value": "littlefishkinder@gmail.com",
          "isPublic": true
        }
      ],
      "placeId": undefined,
      "coordinates": undefined
    }
  ],
  "socialLinks": [
    {
      "platform": "instagram",
      "url": "https://www.instagram.com/little_fish_kinder/"
    }
  ],
  "verification": {
    "status": "pending",
    "submittedAt": "2025-01-15",
    "submittedBy": "system",
    "documents": [],
    "notes": "Verification pending - created from organization data."
  },
  "isVerified": false,
  "internalCRM": {
    "people": [
      {
        "name": "Auntie Tatty",
        "contacts": [],
        "notes": "Principal"
      },
      {
        "name": "Deborah Butler",
        "contacts": [],
        "notes": "Owner"
      }
    ],
    "claimStatus": "unclaimed"
  }
}
```

**Key Fields**:
- `username`: Slugified version of organization name
- `logoPhotoId`: Reference to media ID (will be created in media.json)
- `placeId`: Can be fetched via Google Places API MCP call (optional)
- `coordinates`: Auto-populated if placeId is provided

### Step 4: Upload Media Assets

Use Cloudinary MCP to upload media assets. The MCP supports:
- Remote HTTP/HTTPS URLs (Instagram, Facebook, etc.)
- Local file paths (must start with `file://`)

**Upload logo**:
```typescript
mcp_cloudinary-asset-mgmt_upload-asset({
  uploadRequest: {
    file: "https://instagram.com/image.jpg",
    folder: "o/littlefishkindergarten/photos",
    public_id: "lfk-logo"
  }
})
```

**Upload gallery photos**:
```typescript
// Upload multiple photos
mcp_cloudinary-asset-mgmt_upload-asset({
  uploadRequest: {
    file: "https://instagram.com/photo1.jpg",
    folder: "o/littlefishkindergarten/photos",
    public_id: "lfk-gallery-1"
  }
})
```

### Step 5: Create `media.json`

Create media registry with all uploaded assets:

```json
{
  "media": [
    {
      "id": "lfk-logo",
      "type": "image",
      "url": "https://res.cloudinary.com/dipyku9mn/image/upload/v1766416052/o/littlefishkindergarten/photos/lfk-photo-1.jpg",
      "assetId": "13c77e3d96998dac4eae8425765f74b9",
      "publicId": "o/littlefishkindergarten/photos/lfk-photo-1",
      "width": 768,
      "height": 768,
      "format": "jpg",
      "bytes": 143854,
      "version": 1766416052
    },
    {
      "id": "lfk-gallery-1",
      "type": "image",
      "url": "https://res.cloudinary.com/dipyku9mn/image/upload/v1766416058/o/littlefishkindergarten/photos/lfk-photo-2.jpg",
      "assetId": "e80f9a29b6f36213b81ab38f193db2dd",
      "publicId": "o/littlefishkindergarten/photos/lfk-photo-2",
      "width": 768,
      "height": 768,
      "format": "jpg",
      "bytes": 140094,
      "version": 1766416058
    }
  ]
}
```

**Note**: Copy the response from Cloudinary upload directly into this file.

### Step 6: Create `website.json`

Create website configuration:

```json
{
  "website": {
    "siteName": "Little Fish Kindergarten",
    "title": "Little Fish Kindergarten - Early Childhood Education in Treasure Beach, St. Elizabeth",
    "description": "Little Fish Kindergarten provides quality early childhood education in a nurturing environment. Offering Pre-Nursery, Nursery Year 1, and Nursery Year 2 programs in Treasure Beach, St. Elizabeth, Jamaica. Motto: Fishing For Excellence.",
    "images": [
      {
        "url": "/private-schools/jamaica/st-elizabeth/littlefishkindergarten/website/landing/hero.jpg",
        "width": 1200,
        "height": 600,
        "alt": "Little Fish Kindergarten"
      }
    ],
    "header": {
      "layout": "default",
      "variant": "default",
      "nav": [
        { "key": "home", "label": "Home" },
        { "key": "academics", "label": "Programs" },
        { "key": "workforce", "label": "Our Team" },
        { "key": "contact", "label": "Contact" }
      ],
      "actions": [
        { "key": "apply", "label": "Enroll Now" }
      ]
    },
    "footer": {
      "layout": "default",
      "variant": "default",
      "sections": [
        {
          "key": "social",
          "title": "Little Fish Kindergarten",
          "description": "Fishing For Excellence - Nurturing young minds in Treasure Beach, St. Elizabeth."
        },
        { "key": "academics", "title": "Programs" },
        { "key": "contact", "title": "Contact" }
      ]
    },
    "pages": [
      {
        "name": "home",
        "title": "Welcome to Little Fish Kindergarten",
        "subtitle": "Fishing For Excellence in Early Childhood Education",
        "sections": [
          {
            "type": "hero",
            "layout": "default",
            "variant": "image",
            "title": "Nurturing Young Minds in Treasure Beach",
            "subtitle": "Little Fish Kindergarten provides quality early childhood education in a safe and nurturing environment.",
            "backgroundImage": "/private-schools/jamaica/st-elizabeth/littlefishkindergarten/website/home/hero.webp",
            "actions": [
              { "label": "View Programs", "href": "/programs" },
              { "label": "Contact Us", "href": "/contact" }
            ]
          },
          {
            "type": "programs",
            "title": "Our Nursery Programs",
            "subtitle": "Early childhood education programs designed to foster creativity, learning, and social development."
          }
        ]
      }
    ]
  }
}
```

### Step 7: Create `workforce.json` (for schools)

Create workforce/staff data:

```json
{
  "departments": [
    {
      "name": "Administration",
      "slug": "administration",
      "description": "School administration and leadership",
      "image": "/private-schools/jamaica/st-elizabeth/littlefishkindergarten/team/administration.webp",
      "url": "/private-schools/jamaica/st-elizabeth/littlefishkindergarten/team"
    }
  ],
  "positions": [
    {
      "name": "Principal",
      "slug": "principal",
      "description": "School principal and educational leader",
      "image": "/private-schools/jamaica/st-elizabeth/littlefishkindergarten/team/principal.webp",
      "url": "/private-schools/jamaica/st-elizabeth/littlefishkindergarten/team"
    },
    {
      "name": "Owner",
      "slug": "owner",
      "description": "School owner and proprietor",
      "image": "/private-schools/jamaica/st-elizabeth/littlefishkindergarten/team/owner.webp",
      "url": "/private-schools/jamaica/st-elizabeth/littlefishkindergarten/team"
    }
  ],
  "teams": [],
  "members": [
    {
      "id": "001",
      "slug": "auntie-tatty",
      "name": "Auntie Tatty",
      "bio": "Principal of Little Fish Kindergarten, dedicated to providing quality early childhood education in a nurturing environment.",
      "isPublic": true,
      "contacts": [],
      "roleAssignments": [
        {
          "positionSlug": "principal",
          "departmentSlug": "administration",
          "isPrimary": true
        }
      ],
      "subjectAssignments": []
    }
  ]
}
```

**Important**: 
- Do NOT set `photoId` or `quote` to `null` - omit them entirely if not available
- These fields are optional and should be omitted, not set to null

### Step 8: Create `cycles.json` (for schools)

Create academic and program cycles:

```json
{
  "globalCycles": [],
  "academicCycles": [
    {
      "id": "lfk-2025-t1",
      "startDate": "2025-09-01",
      "endDate": "2025-12-15"
    }
  ],
  "programCycles": [
    {
      "id": "lfk-pre-nursery-2025-t1",
      "academicCycleId": "lfk-2025-t1",
      "teacherSlugs": [],
      "capacity": 20,
      "enrolled": 0,
      "registrationPeriod": {
        "startDate": "2025-07-01",
        "endDate": "2025-08-15"
      },
      "pricingPackage": {
        "pricingItems": [
          {
            "id": "registration",
            "label": "Registration",
            "billingCycle": "one-time",
            "purpose": "registration",
            "amount": {
              "JMD": 5000
            }
          },
          {
            "id": "tuition",
            "label": "Tuition",
            "purpose": "tuition",
            "billingCycle": "term",
            "amount": {
              "JMD": 60000
            }
          }
        ],
        "discounts": [
          {
            "id": "early-bird",
            "label": "Early Bird",
            "message": "Early Bird discount",
            "type": "percentage",
            "value": 100,
            "appliesTo": ["registration"],
            "validUntil": "2025-07-18"
          }
        ]
      }
    }
  ]
}
```

### Step 9: Create `program-groups.json` (for schools)

Create program groups:

```json
{
  "groups": [
    {
      "id": "nursery",
      "slug": "nursery",
      "name": "Nursery",
      "description": "Early childhood education programs for children ages 2-5",
      "order": 1
    }
  ]
}
```

### Step 10: Create `{group}-academic.json` (for schools)

Create academic programs file (e.g., `nursery-academic.json`):

```json
{
  "programs": [
    {
      "id": "lfk-pre-nursery",
      "slug": "pre-nursery",
      "name": "Pre-Nursery (Playschool)",
      "audience": "parent",
      "quickFacts": [
        "{{age}}",
        "Secure",
        "Qualified Teachers"
      ],
      "highlights": [
        {
          "icon": "palette",
          "label": "Creative Play",
          "description": "Children learn through drawing, movement, storytelling, and games."
        }
      ],
      "tagline": "Play, explore, and grow together",
      "outcome": "School Readiness",
      "description": "Strong foundational learning in a nurturing environment",
      "groupId": "nursery",
      "cycleIds": [
        "lfk-pre-nursery-2025-t1"
      ],
      "isPopular": true,
      "activities": [
        {
          "id": "story-time",
          "title": "📚 Story Time"
        }
      ],
      "courses": [
        {
          "id": "lfk-pre-nursery-tracing",
          "subject": {
            "id": "pre-sensory",
            "name": "Motor Skills"
          },
          "title": "Tracing and Fine Motor Control",
          "description": "Develop hand-eye coordination and pre-writing skills.",
          "units": [
            {
              "title": "Line and Shape Tracing",
              "topics": ["Straight lines", "Curves", "Zigzag", "Basic shapes"]
            }
          ]
        }
      ],
      "admission": {
        "id": "lfk-pre-nursery-admission",
        "eligibility": [
          {
            "type": "age",
            "ageRange": {
              "minAgeYears": 2,
              "maxAgeYears": 3
            }
          }
        ],
        "documents": [
          {
            "type": "document",
            "name": "Birth Certificate",
            "requirement": "required"
          }
        ]
      },
      "requirements": [
        {
          "name": "Books",
          "category": "booklist",
          "audience": "parent",
          "items": [
            {
              "itemId": "book-123-starters-coloring"
            }
          ]
        }
      ],
      "media": {
        "galleryIds": ["lfk-gallery-1", "lfk-gallery-2"]
      }
    }
  ]
}
```

**Important**: 
- Use `items` array with `itemId` objects, NOT `itemIds` array
- Each requirement item should have `{ "itemId": "..." }` structure
- Optional fields: `quantity`, `unit`, `notes`

### Step 11: Create `index.ts`

Create the main index file that imports and parses all JSON:

```typescript
import type { OrgInstance } from "~/modules/organisations/types";
import { parseOrgInstance } from "../../../../utils/parseOrgInstance";
import { parseMediaModule } from "../../../../utils/parseMediaModule";

// Import JSON files
import orgData from "./org.json";
import websiteData from "./website.json";
import mediaData from "./media.json";
import cyclesData from "./cycles.json";
import programGroupsData from "./program-groups.json";
import nurseryAcademicData from "./nursery-academic.json";
import workforceData from "./workforce.json";

/**
 * Little Fish Kindergarten organization instance
 * All data loaded from JSON files and parsed using the parser utilities
 */
export const LITTLE_FISH_KINDERGARTEN_ORG: OrgInstance = parseOrgInstance({
	jsonData: {
		org: orgData,
		website: websiteData,
		media: mediaData,
		cycles: cyclesData,
		programGroups: programGroupsData,
		groupAcademic: [nurseryAcademicData],
		workforce: workforceData,
	},
});

// Add media array to org from media.json
// Only include gallery photos (exclude logo which is already in logoPhotoId)
const mediaMap = parseMediaModule(mediaData);
const galleryMediaIds = ["lfk-gallery-1", "lfk-gallery-2"];
LITTLE_FISH_KINDERGARTEN_ORG.org.media = galleryMediaIds
	.map((id) => mediaMap.get(id))
	.filter((media): media is NonNullable<typeof media> => media !== undefined);
```

### Step 12: Update Parent Index Files

Add the new organization to parent index files:

1. **Region index** (e.g., `st-elizabeth/index.ts`):
```typescript
import { LITTLE_FISH_KINDERGARTEN_ORG } from "./littlefishkindergarten";

export const ST_ELIZABETH_PRIVATE_SCHOOLS_JAMAICA: OrgInstance[] = [
  // ... other orgs
  LITTLE_FISH_KINDERGARTEN_ORG,
];
```

2. **Country and category indexes** are automatically included via spread operators.

### Step 13: Update Documentation

Update `docs/data/crm.md` to add the new organization as an example path:

```markdown
- **Private Kindergarten in Jamaica**: `apps/sovoli.com/src/modules/data/organisations/private-schools/jamaica/st-elizabeth/littlefishkindergarten/index.ts`
```

## Common Patterns

### Currency Codes

- **Jamaica**: `JMD`
- **Guyana**: `GYD`
- **United States**: `USD`

### Program Cycle IDs

Follow pattern: `{org-prefix}-{program-slug}-{year}-{term}`

Example: `lfk-pre-nursery-2025-t1`

### Media IDs

Follow pattern: `{org-prefix}-{type}-{number}`

- Logo: `{org-prefix}-logo`
- Gallery: `{org-prefix}-gallery-1`, `{org-prefix}-gallery-2`, etc.

### Username/Slug

- Use lowercase
- Replace spaces with nothing (no hyphens)
- Remove special characters
- Example: "Little Fish Kindergarten" → `littlefishkindergarten`

## Validation Checklist

Before completing onboarding, verify:

- [ ] All JSON files are valid (no syntax errors)
- [ ] `org.json` has `logoPhotoId` matching a media entry
- [ ] `media.json` contains all referenced media IDs
- [ ] `workforce.json` has no `null` values (omit optional fields instead)
- [ ] `cycles.json` program cycles reference valid academic cycles
- [ ] `{group}-academic.json` programs reference valid cycle IDs
- [ ] `{group}-academic.json` requirements use `items` array with `itemId` objects
- [ ] `index.ts` imports all JSON files
- [ ] `index.ts` adds gallery media to `org.media` array
- [ ] Parent index files include the new organization
- [ ] Typecheck passes: `pnpm typecheck`
- [ ] Linting passes: `pnpm lint`
- [ ] Organization accessible at `http://{username}.localhost:3000`

## Troubleshooting

### Error: "OrgInstance is missing a website module"
- **Solution**: Ensure `website.json` exists and is imported in `index.ts`

### Error: "Invalid input: expected string, received null"
- **Solution**: Remove `null` values from optional fields in `workforce.json`. Omit the field entirely if not available.

### Error: "Cannot find module"
- **Solution**: Check import paths in `index.ts`. Use relative paths like `../../../../utils/parseOrgInstance`

### Media not showing
- **Solution**: Verify `media.json` has correct IDs, and `org.media` array is populated in `index.ts`

## Example: Little Fish Kindergarten

Complete example structure:
```
littlefishkindergarten/
├── index.ts
├── org.json
├── website.json
├── media.json
├── workforce.json
├── cycles.json
├── program-groups.json
└── nursery-academic.json
```

## Next Steps After Onboarding

1. **Test the organization page**: Visit `http://{username}.localhost:3000`
2. **Verify all modules load**: Check programs, workforce, media gallery
3. **Test program pages**: Verify each program displays correctly
4. **Check media**: Ensure logo and gallery photos display
5. **Verify navigation**: Test website navigation and links

## Questions to Ask During Onboarding

1. **Organization Details**
   - What is the full official name?
   - What is the motto or tagline?
   - What categories apply? (private-school, nursery-school, etc.)

2. **Location**
   - Full address with all details
   - Primary phone number
   - Email address
   - Social media links (Instagram, Facebook, etc.)

3. **Staff**
   - Who is the principal/owner?
   - What are their roles?
   - Any other key staff members?

4. **Programs** (for schools)
   - What programs do you offer?
   - What are the age ranges?
   - What is the pricing structure?
   - When are registration periods?

5. **Media**
   - Do you have a logo?
   - Do you have photos we can use? (Instagram/Facebook links work)
   - What photos should go in the gallery?

6. **Verification**
   - What is the verification status?
   - Any documents to include?

## Reference Files

- **Example Organization**: `apps/sovoli.com/src/modules/data/organisations/vocational-school/jamaica/healingemeraldwellness/`
- **Example Private School**: `apps/sovoli.com/src/modules/data/organisations/private-schools/guyana/modernacademy/`
- **CRM Documentation**: `docs/data/crm.md`

