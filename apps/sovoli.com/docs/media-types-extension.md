# Extended Media Type Support

## Overview

The Media type system has been extended to support not only images and videos, but also documents (PDFs, spreadsheets, presentations), audio files, and other file types. However, **galleries automatically filter out non-visual media** - so PDFs and documents can be stored and associated with projects/events/etc., but won't appear in image/video carousels.

## Supported Media Types

### Visual Media (shown in galleries)

- **`image`** - Images (jpg, png, webp, etc.)
- **`video`** - Videos (mp4, webm, etc.)

### Non-Visual Media (not shown in galleries, but can be stored)

- **`pdf`** - PDF documents
- **`document`** - Word documents, text files, etc.
- **`spreadsheet`** - Excel, CSV files, etc.
- **`presentation`** - PowerPoint, Keynote files, etc.
- **`audio`** - Audio files (mp3, wav, etc.)

## Key Features

### 1. Automatic Gallery Filtering

All gallery components (`GalleryCarousel`, `ProjectCarousel`, `OrgGalleryCarousel`) automatically filter to only show visual media:

```typescript
import { filterVisualMedia } from "~/modules/core/media/types";

// In gallery components:
const visualMedia = filterVisualMedia(photos); // Only images and videos
```

This means:

- ✅ PDFs and documents can be stored in `photos: Media[]` arrays
- ✅ They won't appear in galleries
- ✅ They can be accessed programmatically for download links, etc.

### 2. Optional Category for Non-Visual Media

The `category` field is now optional, allowing PDFs and documents to be stored without photo categories:

```typescript
// Visual media (images/videos) - category is optional but recommended
{
  type: "image",
  category: "environment", // Optional
  url: "...",
  publicId: "..."
}

// Non-visual media (PDFs) - category not needed
{
  type: "pdf",
  url: "...",
  publicId: "...",
  pages: 5 // Document-specific field
}
```

### 3. Type-Specific Fields

The Media interface includes type-specific optional fields:

```typescript
// Video fields
duration?: number;
videoCodec?: string;
fps?: number;
posterUrl?: string;

// Document fields
pages?: number; // Number of pages for PDFs

// Audio fields
audioDuration?: number;
audioBitrate?: number;
```

### 4. Helper Functions

```typescript
// Type guard to check if media is visual
import { isVisualMedia } from "~/modules/core/media/types";
if (isVisualMedia(media)) {
  // media is guaranteed to be image or video
}

// Filter array to only visual media
import { filterVisualMedia } from "~/modules/core/media/types";
const galleryItems = filterVisualMedia(allMedia);
```

## Usage Examples

### Storing PDFs with Projects

```typescript
// In projects.json or projects.ts
{
  id: "project-1",
  title: "School Renovation",
  photos: [
    {
      type: "image",
      category: "environment",
      url: "https://...",
      publicId: "renovation-photo"
    },
    {
      type: "pdf",
      url: "https://...",
      publicId: "renovation-plan",
      pages: 12,
      caption: "Renovation Plan PDF"
    }
  ]
}
```

The gallery will automatically show only the image, but the PDF is still accessible in the `photos` array for download links or other uses.

### Accessing All Media (Including PDFs)

```typescript
// In a component that needs to show download links
const project = ...;

// Get all media including PDFs
const allMedia = project.photos ?? [];

// Filter to only PDFs
const pdfs = allMedia.filter(m => m.type === "pdf");

// Filter to only visual (for galleries)
const visualMedia = filterVisualMedia(allMedia);
```

## Backward Compatibility

- ✅ Existing `Photo[]` arrays still work (Photo is `Media & { type: "image" }`)
- ✅ All existing galleries continue to work
- ✅ No breaking changes to existing code
- ✅ Old photos without `type` field default to `"image"`

## Uploading Different Media Types

When uploading files to Cloudinary:

1. **Images/Videos**: Upload as before - they'll appear in galleries
2. **PDFs/Documents**: Upload the same way, but:
   - Set `type: "pdf"` (or appropriate type) in the metadata
   - They'll be stored but won't appear in galleries
   - Use `pages` field if available from Cloudinary

## Gallery Behavior

- **Shows**: Images and videos only
- **Hides**: PDFs, documents, spreadsheets, presentations, audio files
- **Filtering**: Automatic via `filterVisualMedia()` helper
- **No Changes Needed**: Existing galleries work without modification
