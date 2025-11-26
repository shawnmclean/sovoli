# Photos → Media Property Rename

## Overview

This document tracks the migration of property names from `photos` to `media` throughout the codebase.

## Migration Status

### ✅ Core Type Definitions Updated
- `apps/sovoli.com/src/modules/projects/types.ts` - `photos?: Media[]` → `media?: Media[]`
- `apps/sovoli.com/src/modules/events/types.ts` - `photos?: Media[]` → `media?: Media[]`
- `apps/sovoli.com/src/modules/organisations/types.ts` - `photos?: Media[]` → `media?: Media[]`
- `apps/sovoli.com/src/modules/academics/types.ts` - `photos?: Media[]` → `media?: Media[]`
- `apps/sovoli.com/src/modules/core/items/types.ts` - `photos?: Media[]` → `media?: Media[]`
- `apps/sovoli.com/src/app/(temp)/projects/types.ts` - `photos: Media[]` → `media: Media[]`, `coverPhoto` → `coverMedia`

### ✅ JSON Schema Updated
- `apps/sovoli.com/src/modules/data/organisations/utils/parseProjectsModule.ts`
  - Schema: `photos` → `media` (with backward compatibility for `photos`)
  - Parser: Maps `projectJson.media ?? projectJson.photos` to `project.media`

### ✅ Components Updated
- `apps/sovoli.com/src/components/GalleryCarousel.tsx` - Prop `photos` → `media`
- `apps/sovoli.com/src/app/(temp)/projects/components/ProjectCarousel.tsx` - Prop `photos` → `media`
- All layout files using `.photos` → `.media`

### ⏳ Remaining Files

#### Form Components (May Keep `photos` for internal clarity)
- `apps/sovoli.com/src/app/(temp)/needs/new/components/ReliefForm.tsx`
- `apps/sovoli.com/src/app/(temp)/needs/new/components/DamagePhotosUpload.tsx`
- `apps/sovoli.com/src/app/(temp)/needs/new/components/ProjectStep.tsx`

**Note:** Form components may keep internal prop names as `photos` for UX clarity, but the data structure saved should use `media`.

#### JSON Data Files
All JSON files with `"photos"` arrays should be updated to `"media"`:
- `apps/sovoli.com/src/modules/data/organisations/**/*.json`

#### InlinePhotos Component
- `apps/sovoli.com/src/app/[username]/(profile)/[slug]/components/InlinePhotos.tsx`
  - Uses `photos: Media[]` prop - consider if this should be `media: Media[]`

## Migration Pattern

### Type Definitions
```typescript
// Before
interface Project {
  photos?: Media[];
}

// After
interface Project {
  media?: Media[];
}
```

### Property Access
```typescript
// Before
const photos = project.photos ?? [];
const coverPhoto = photos[0];

// After
const media = project.media ?? [];
const coverMedia = media[0];
```

### Component Props
```typescript
// Before
<GalleryCarousel photos={media} />

// After
<GalleryCarousel media={media} />
```

### JSON Schema (with backward compatibility)
```typescript
// Schema accepts both for backward compatibility
media: z.array(mediaJsonSchema).optional(),
photos: z.array(mediaJsonSchema).optional(), // Legacy

// Parser prefers media, falls back to photos
media: (projectJson.media ?? projectJson.photos) as Media[] | undefined,
```

## Backward Compatibility

The parser supports both `photos` and `media` in JSON files for backward compatibility. Existing JSON files can be migrated gradually.

## Verification Checklist

- [ ] All type definitions use `media`
- [ ] All component props use `media`
- [ ] All property accesses use `.media`
- [ ] JSON schema accepts both `photos` and `media` (temporary)
- [ ] All JSON data files migrated to use `media`
- [ ] TypeScript compilation succeeds
- [ ] No linter errors

## Next Steps

1. Update remaining component prop names
2. Migrate JSON data files
3. Remove backward compatibility support for `photos` in schema (after all JSON files migrated)
4. Update documentation

