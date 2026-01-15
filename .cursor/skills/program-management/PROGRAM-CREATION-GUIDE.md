# Program Creation & Update Guide

This guide documents the process for creating and updating programs in the Sovoli platform. Use this guide when adding new programs or updating existing ones for any tenant organization.

## Overview

Programs in Sovoli are stored as JSON data files within each organization's directory structure. Each program requires configuration across multiple files:

1. **Program Definition** - Core program details, capabilities, requirements
2. **Cycle Configuration** - Academic cycles, program cycles, pricing, capacity
3. **Program Groups** - Organization and categorization of programs
4. **Supply Lists** - Items required for the program (must exist in global items database first)

## File Structure

Programs are located in:
```
apps/sovoli.com/src/modules/data/organisations/
├── {category}/
│   ├── {country}/
│   │   ├── {region?}/
│   │   │   ├── {tenant-name}/
│   │   │   │   ├── {program-group}-academic.json  # Program definitions
│   │   │   │   ├── cycles.json                    # Academic & program cycles
│   │   │   │   ├── program-groups.json            # Program group definitions
│   │   │   │   └── org.json                       # Organization metadata
```

## Step-by-Step Process

### 1. Confirm Tenant and Program Details

**Before starting, always confirm:**
- ✅ Tenant name and username (e.g., "Healing Emerald Wellness Spa & Training Centre Limited" / "healingemeraldwellness")
- ✅ Program name and slug
- ✅ Whether this is a new program or updating an existing one
- ✅ Program duration, schedule, start/end dates
- ✅ Pricing (registration fee, tuition)
- ✅ Capacity (maximum students)
- ✅ Teacher assignment (if applicable)

### 2. Update/Create Program Definition

**File**: `{program-group}-academic.json` (e.g., `massage-therapy-academic.json`)

**Structure**:
```json
{
  "programs": [
    {
      "id": "tenant-slug-program-name",
      "slug": "program-slug",
      "name": "Program Name",
      "audience": "student" | "parent",
      "quickFacts": ["Fact 1", "Fact 2"],
      "highlights": [
        {
          "icon": "icon-name",
          "label": "Highlight Label",
          "description": "Description text"
        }
      ],
      "tagline": "Short tagline",
      "outcome": "Program outcome description",
      "description": "Full program description",
      "capabilities": [
        {
          "outcome": "Capability outcome statement",
          "competencies": [
            {
              "statement": "Competency statement"
            }
          ]
        }
      ],
      "certification": {
        "description": "Certification details"
      },
      "groupId": "program-group-id",
      "cycleIds": ["cycle-id-1", "cycle-id-2"],
      "media": {
        "coverId": "media-id",
        "galleryIds": ["media-id-1", "media-id-2"]
      },
      "requirements": [
        {
          "name": "Supply List",
          "category": "materials",
          "audience": "student",
          "items": [
            {
              "itemId": "item-id",
              "quantity": 1,
              "notes": "Optional notes"
            }
          ]
        }
      ]
    }
  ]
}
```

**Key Fields**:
- `id`: Unique program identifier (format: `{tenant-prefix}-{program-slug}`)
- `slug`: URL-friendly identifier (kebab-case)
- `capabilities`: Convert course units into capability outcomes with competencies
- `requirements`: Supply list items (see Supply List section below)

### 3. Update Cycle Configuration

**File**: `cycles.json`

**Structure**:
```json
{
  "globalCycles": [],
  "academicCycles": [
    {
      "id": "cycle-id",
      "customLabel": "Cycle Label",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD"
    }
  ],
  "programCycles": [
    {
      "id": "program-cycle-id",
      "academicCycleId": "academic-cycle-id",
      "teacherSlugs": ["teacher-slug-1"],
      "capacity": 2,
      "enrolled": 0,
      "pricingPackage": {
        "pricingItems": [
          {
            "id": "registration",
            "label": "Registration",
            "billingCycle": "one-time",
            "purpose": "registration",
            "amount": {
              "JMD": 3000
            },
            "notes": "Optional notes"
          },
          {
            "id": "tuition",
            "label": "Tuition",
            "purpose": "tuition",
            "billingCycle": "program" | "one-time" | "term" | "annual",
            "amount": {
              "JMD": 100000
            }
          }
        ],
        "discounts": [],
        "paymentSplits": []
      },
      "status": "open" | "closed" | "hidden",
      "registrationPeriod": {
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD"
      }
    }
  ]
}
```

**Cycle ID Format**: `{program-slug}-{start-date}` (e.g., `spa-therapy-20260121`)

**Pricing Package**:
- `billingCycle`: `"one-time"` for registration, `"program"` for program-length tuition
- `amount`: Object with currency codes (JMD, USD, GYD)
- `paymentSplits`: Optional payment plans (see examples in existing cycles)

### 4. Update Program Groups

**File**: `program-groups.json`

**Structure**:
```json
{
  "groups": [
    {
      "id": "group-id",
      "slug": "group-slug",
      "name": "Group Name",
      "description": "Group description",
      "order": 1
    }
  ]
}
```

**Note**: If the program group doesn't exist, create it. Ensure the `groupId` in the program definition matches the group `id`.

### 5. Supply List Requirements

**CRITICAL**: Items must exist in the global items database before adding them to supply lists.

**Items Database Location**: `apps/sovoli.com/src/modules/data/items/index.ts`

**Process**:
1. **Check if items exist**: Search the items database for existing items
   - Common items: towels, notebooks, pens, hand sanitizer, disinfectants
   - Check: `apps/sovoli.com/src/modules/data/items/library/` for item files
2. **If items don't exist**: Note them for creation (separate task)
   - Do NOT add non-existent items to supply lists
   - The system will filter them out, but it's better to verify first
3. **Add items to requirements**: Use existing item IDs only

**Supply List Structure**:
```json
{
  "name": "Supply List",
  "category": "materials",
  "audience": "student",
  "items": [
    {
      "itemId": "existing-item-id",
      "quantity": 1,
      "unit": "optional-unit-label",
      "isOptional": false,
      "source": "bring" | "buy-at-school" | "either",
      "notes": "Optional clarification notes"
    }
  ]
}
```

**Common Item IDs** (verify these exist):
- `twin-size-flat-sheets-dark`
- `large-bath-towels-dark`
- `small-face-towels-dark`
- `hand-towel-roll`
- `supply-exercise-book-big`
- `supply-pencils-pack-12`
- `hand-sanitizer-antiseptic`
- `alcohol-disinfectant`
- `spray-bottle`
- `applicator-bottle`

### 6. Validation Checklist

Before completing, verify:

- [ ] Program ID follows naming convention: `{tenant-prefix}-{program-slug}`
- [ ] Program slug is kebab-case and matches URL expectations
- [ ] All cycle dates are correct (start date, end date, duration matches)
- [ ] Academic cycle dates match program cycle dates
- [ ] Pricing amounts are correct (currency codes match)
- [ ] Teacher slugs exist in `workforce.json`
- [ ] Capacity is set appropriately
- [ ] Program group exists in `program-groups.json`
- [ ] All supply list items exist in global items database
- [ ] Capabilities structure follows pattern (outcomes with competencies)
- [ ] Media IDs exist (coverId, galleryIds)

## Common Patterns

### Converting Course Units to Capabilities

Course units should be grouped into logical capability outcomes:

**Example**:
- Course Unit: "Perform Dry Body Brushing Techniques"
- Becomes: Capability outcome "Perform **Dry Body Brushing** techniques safely and effectively"
- With competency: "Perform dry body brushing for exfoliation and lymphatic stimulation"

### Pricing Structure

**Registration Fee**:
```json
{
  "id": "registration",
  "label": "Registration",
  "billingCycle": "one-time",
  "purpose": "registration",
  "amount": {"JMD": 3000}
}
```

**Tuition**:
```json
{
  "id": "tuition",
  "label": "Tuition",
  "purpose": "tuition",
  "billingCycle": "program",
  "amount": {"JMD": 100000}
}
```

### Payment Splits (Optional)

For split payment plans:
```json
{
  "paymentSplits": [
    {
      "id": "tuition-upfront",
      "pricingItemId": "tuition",
      "percentage": 50,
      "dueAt": {
        "type": "now"
      },
      "note": "Upon registration"
    },
    {
      "id": "tuition-week4",
      "pricingItemId": "tuition",
      "percentage": 50,
      "dueAt": {
        "type": "after_start",
        "count": 3,
        "unit": "week"
      },
      "note": "Before week 4"
    }
  ]
}
```

## Examples

### Example: Spa Therapy Program

See: `apps/sovoli.com/src/modules/data/organisations/vocational-school/jamaica/healingemeraldwellness/`

- **Program Definition**: `massage-therapy-academic.json` (spa-therapy entry)
- **Cycle Configuration**: `cycles.json` (spa-therapy-20260121)
- **Program Group**: `program-groups.json` (spa-therapy group)

## Troubleshooting

### Items Not Showing in Supply List

- **Cause**: Item doesn't exist in global items database
- **Solution**: Verify item ID exists in `apps/sovoli.com/src/modules/data/items/`
- **Check**: The system filters out invalid items, but verify first

### Cycle Not Appearing

- **Cause**: Cycle ID mismatch between program definition and cycles.json
- **Solution**: Ensure `cycleIds` in program match `id` in `programCycles`

### Pricing Not Displaying

- **Cause**: Missing or empty `pricingPackage` in program cycle
- **Solution**: Verify `pricingItems` array is populated with correct structure

## Related Documentation

- [Data Layer Documentation](../../docs/data/README.md)
- [Onboarding Guide](../../docs/data/onboarding.md)
- [CRM Data Location](../../docs/data/crm.md)
