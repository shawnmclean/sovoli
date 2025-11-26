# Video Support Strategy for Cloudinary

## Current State Analysis

### What We Have:
- **Photo type**: Defined in `~/modules/core/photos/types.ts` with Cloudinary fields
- **GalleryCarousel component**: Uses `CldImage` from `next-cloudinary` for images only
- **parseProjectsModule**: Validates and parses photos from JSON
- **Cloudinary upload**: Uses `/auto/upload` endpoint which already supports videos
- **Projects**: Have `photos?: Photo[]` field

### What's Missing:
- Video type definition
- Video support in GalleryCarousel
- Video validation in parsers
- Video component from next-cloudinary

## Recommended Approach: Unified Media Type

Instead of creating a separate `Video` type, we should create a unified `Media` type that can represent both images and videos. This approach:

✅ Keeps the API consistent  
✅ Allows mixed photo/video galleries  
✅ Simplifies type checking  
✅ Maintains backward compatibility  

## Implementation Plan

### Step 1: Create Unified Media Type

Create `apps/sovoli.com/src/modules/core/media/types.ts`:

```typescript
export type MediaType = "image" | "video";

export interface Media {
  type: MediaType;
  category:
    | "environment"
    | "classroom"
    | "activities"
    | "events"
    | "awards"
    | "default";
  
  // Common fields
  url: string;
  caption?: string;
  alt?: string;
  publicId: string; // Cloudinary public ID
  
  // Cloudinary fields
  assetId?: string;
  bucket?: string;
  id?: string;
  path?: string | null;
  format?: string;
  bytes?: number;
  version?: number;
  uploadedAt?: string;
  
  // Image-specific fields
  width?: number;
  height?: number;
  
  // Video-specific fields
  duration?: number; // Duration in seconds
  videoCodec?: string; // e.g., "h264", "vp9"
  audioCodec?: string; // e.g., "aac"
  fps?: number; // Frames per second
  bitrate?: number; // Video bitrate
}
```

### Step 2: Maintain Photo Type as Alias (Backward Compatibility)

Keep `Photo` type but make it a type alias:

```typescript
// In ~/modules/core/photos/types.ts
import type { Media } from "~/modules/core/media/types";

export type Photo = Media & { type: "image" };
```

### Step 3: Update parseProjectsModule

Extend the schema to support both images and videos:

```typescript
const mediaJsonSchema = z.object({
  type: z.enum(["image", "video"]).default("image"),
  url: z.string(),
  publicId: z.string(),
  // ... all other fields
  duration: z.number().optional(), // Video-specific
  videoCodec: z.string().optional(),
  // ...
});
```

### Step 4: Update GalleryCarousel Component

The component should:
- Accept `Media[]` instead of `Photo[]`
- Render `CldImage` for images
- Render `CldVideo` (or fallback `<video>`) for videos
- Handle mixed galleries

### Step 5: Video Component Options

**Option A: Use next-cloudinary's CldVideo** (if available in v6.16.0)

```tsx
import { CldVideo } from "next-cloudinary";

<CldVideo
  src={media.publicId}
  width={media.width}
  height={media.height}
  controls
  className="object-contain"
/>
```

**Option B: Use @cloudinary/react (if next-cloudinary doesn't have CldVideo)**

```tsx
import { AdvancedVideo } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
  cloud: { cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME }
});

<AdvancedVideo cldVid={cld.video(media.publicId)} controls />
```

**Option C: Native HTML5 video** (fallback)

```tsx
<video
  src={media.url}
  controls
  className="object-contain"
  poster={media.posterUrl} // Use thumbnail for poster
/>
```

## Cloudinary Video Considerations

### Upload Response Fields

When uploading videos to Cloudinary, the response includes:
- `duration`: Video length in seconds
- `video`: Object with codec, bitrate, etc.
- `audio`: Object with codec, bitrate, etc.
- `format`: Video format (mp4, webm, etc.)
- `fps`: Frames per second
- `width`, `height`: Video dimensions

### Video Transformations

Cloudinary supports video transformations:
- Resizing: `c_fill,w_720,h_480`
- Format conversion: `f_mp4`
- Quality adjustment: `q_auto`
- Thumbnail generation: `so_0` (second offset)

### Performance Optimization

1. **Generate thumbnails** for video previews
2. **Lazy load videos** - only load when in viewport
3. **Use different quality levels** based on device
4. **Preload metadata only** - `preload="metadata"`

## Migration Path

### Phase 1: Extend Types (Non-Breaking)
- Add `Media` type
- Keep `Photo` as type alias
- Update parsers to accept both

### Phase 2: Update Components
- Update GalleryCarousel to handle videos
- Add video rendering logic
- Test with existing photos

### Phase 3: Update Projects/Needs
- Change `photos?: Photo[]` to `media?: Media[]` (with migration)
- Or keep `photos` but allow videos in it

### Phase 4: Update Upload Flow
- Update upload handlers to detect video files
- Extract video metadata on upload
- Store video-specific fields

## Example: Updated GalleryCarousel

```tsx
function MediaItem({ media }: { media: Media }) {
  if (media.type === "video") {
    return (
      <div className="relative aspect-square">
        <CldVideo
          src={media.publicId}
          width={media.width ?? 448}
          height={media.height ?? 448}
          controls
          className="object-contain w-full h-full"
        />
      </div>
    );
  }
  
  return (
    <CldImage
      src={media.publicId}
      alt={media.alt ?? "Image"}
      width={448}
      height={448}
      className="object-cover"
    />
  );
}
```

## Testing Strategy

1. **Backward Compatibility**: Ensure existing photo-only galleries still work
2. **Mixed Galleries**: Test galleries with both photos and videos
3. **Video Only**: Test video-only galleries
4. **Upload Flow**: Test video upload and metadata extraction
5. **Responsive**: Test on mobile/tablet/desktop

## Questions to Consider

1. **Should we allow videos in all contexts?** (Projects, Needs, Events, etc.)
2. **File size limits?** Videos are larger than images
3. **Autoplay policy?** Should videos autoplay or require user interaction?
4. **Thumbnail strategy?** Generate on upload or on-demand?
5. **Migration strategy?** Gradual or all-at-once for existing `Photo[]` fields?

