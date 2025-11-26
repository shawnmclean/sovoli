# Photo → Media Migration Status

## Overview

This document tracks the migration from `Photo` type to `Media` type across the codebase.

## Migration Pattern

For each file that uses `Photo`:

1. **Replace import:**
   ```typescript
   // Before
   import type { Photo } from "~/modules/core/photos/types";
   
   // After
   import type { Media } from "~/modules/core/media/types";
   ```

2. **Replace type annotations:**
   ```typescript
   // Before
   const PHOTOS: Photo[] = [...]
   
   // After
   const PHOTOS: Media[] = [...]
   ```

3. **Add `type: "image"` to all photo objects:**
   ```typescript
   // Before
   {
     category: "default",
     url: "...",
     publicId: "..."
   }
   
   // After
   {
     type: "image",
     category: "default",
     url: "...",
     publicId: "..."
   }
   ```

4. **Update exports:**
   ```typescript
   // Before
   export const PHOTOS: Photo[] = [...]
   
   // After
   export const PHOTOS: Media[] = [...]
   ```

## Files Already Updated ✅

- ✅ `apps/sovoli.com/src/modules/core/photos/types.ts` - Photo is now an alias
- ✅ `apps/sovoli.com/src/modules/core/media/types.ts` - Main Media type
- ✅ `apps/sovoli.com/src/components/GalleryCarousel.tsx`
- ✅ `apps/sovoli.com/src/app/(temp)/projects/components/ProjectCarousel.tsx`
- ✅ `apps/sovoli.com/src/app/(tenants)/w/[username]/(main-layout)/components/OrgGalleryCarousel.tsx`
- ✅ `apps/sovoli.com/src/modules/data/organisations/utils/parseProjectsModule.ts`
- ✅ `apps/sovoli.com/src/modules/projects/types.ts`
- ✅ `apps/sovoli.com/src/modules/events/types.ts`
- ✅ `apps/sovoli.com/src/modules/academics/types.ts`
- ✅ `apps/sovoli.com/src/modules/organisations/types.ts`
- ✅ `apps/sovoli.com/src/modules/core/items/types.ts`
- ✅ `apps/sovoli.com/src/modules/notes/services/types.ts`
- ✅ `apps/sovoli.com/src/app/(temp)/needs/new/components/DamagePhotosUpload.tsx`
- ✅ `apps/sovoli.com/src/app/(temp)/needs/new/components/ProjectStep.tsx`
- ✅ `apps/sovoli.com/src/app/(temp)/projects/types.ts`
- ✅ `apps/sovoli.com/src/app/[username]/(profile)/components/KnowledgeCard.tsx`
- ✅ `apps/sovoli.com/src/modules/notes/services/KnowledgeFileCache.ts`
- ✅ `apps/sovoli.com/src/modules/data/organisations/private-schools/guyana/modernacademy/photos.ts`
- ✅ `apps/sovoli.com/src/modules/data/organisations/private-schools/guyana/bacchuslearning/photos.ts`
- ✅ `apps/sovoli.com/src/modules/data/organisations/stationary/guyana/creativethinking/photos.ts`
- ✅ `apps/sovoli.com/src/modules/data/organisations/stationary/guyana/argosybookstore/index.ts`

## Files Remaining to Update ⏳

Run this command to find remaining files:
```bash
grep -r "Photo\[\]\|import.*Photo.*from.*photos/types" apps/sovoli.com/src --include="*.ts" --include="*.tsx"
```

### Photos Data Files
- ⏳ `apps/sovoli.com/src/modules/data/organisations/hardware/jamaica/mongolsbuildersdepot/photos.ts`
- ⏳ `apps/sovoli.com/src/modules/data/organisations/vocational-school/guyana/fitright/photos.ts`
- ⏳ `apps/sovoli.com/src/modules/data/organisations/public-schools/jamaica/st-elizabeth/appleton/photos.ts`

### Event Files
- ⏳ `apps/sovoli.com/src/modules/data/organisations/private-schools/guyana/bacchuslearning/events/diwali-celebration-2025.ts`
- ⏳ `apps/sovoli.com/src/modules/data/organisations/private-schools/guyana/modernacademy/events/*.ts` (multiple files)

### Index Files
- ⏳ `apps/sovoli.com/src/modules/data/organisations/hardware/jamaica/philshardware/index.ts`

## JSON Files

For JSON files (like `projects.json`), photos should have `type: "image"` added:

```json
{
  "projects": [
    {
      "photos": [
        {
          "type": "image",
          "category": "default",
          "url": "...",
          "publicId": "..."
        }
      ]
    }
  ]
}
```

## Verification

After migration, verify:
1. ✅ All imports use `Media` not `Photo`
2. ✅ All type annotations use `Media[]` not `Photo[]`
3. ✅ All photo objects have `type: "image"` field
4. ✅ TypeScript compilation succeeds
5. ✅ No linter errors

## Running the Migration Script

A migration script is available at:
```
apps/sovoli.com/scripts/migrate-photos-to-media.mjs
```

⚠️ **Note:** The script may need refinement. Review changes carefully before committing.

