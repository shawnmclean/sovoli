# Uploading Media Files and Adding to Programs

**Always use the upload script instead of MCP tools** for uploading media to Cloudinary. Follow these exact steps:

## Step 1: Determine the Organization Path

The `<org-path>` parameter follows this pattern: `o/<category>/<country>/<region>/<organization-name>`

**How to find it:**
- Look at the file path of the program/project JSON file you're working with
- Example: `apps/sovoli.com/src/modules/data/organisations/private-schools/jamaica/st-elizabeth/littlefishkindergarten/nursery-academic.json`
- Extract the path after `organisations/`: `private-schools/jamaica/st-elizabeth/littlefishkindergarten`
- Add `o/` prefix: `o/private-schools/jamaica/st-elizabeth/littlefishkindergarten`

**Common patterns:**
- Private schools: `o/private-schools/jamaica/<region>/<school-name>`
- Vocational training: `o/vocational-school/<country>/<region>/<org-name>`
- Other organizations: `o/<category>/<country>/<region>/<org-name>`

**Subdirectories for team member assets:**
- Team member photos/certificates: `o/<category>/<country>/<region>/<org-name>/team/<member-name>`
- Example: `o/vocational-school/jamaica/healingemeraldwellness/team/alicia`

## Step 2: Upload Media Files

Use the upload script with the correct paths. You can run it from either the workspace root or the `apps/sovoli.com` directory:

**From workspace root:**
```bash
pnpm --filter @sovoli/sovoli.com exec -- pnpm with-env node scripts/upload-media.mjs <file-path> <org-path>
```

**From apps/sovoli.com directory:**
```bash
pnpm with-env node scripts/upload-media.mjs <file-path> <org-path>
```

**File path options:**
- Absolute path: `"E:\Developers\sovoli\tmp\image.jpg"` (use quotes for Windows paths with spaces)
- Relative path from workspace root: `"tmp/image.jpg"`

**Org-path options:**
- Base organization path: `o/vocational-school/jamaica/healingemeraldwellness`
- With subdirectories: `o/vocational-school/jamaica/healingemeraldwellness/team/alicia` (for team member assets)

**Examples:**
```bash
# Upload image from workspace root (absolute path)
pnpm --filter @sovoli/sovoli.com exec -- pnpm with-env node scripts/upload-media.mjs "E:\Developers\sovoli\tmp\spa-standards.png" "o/vocational-school/jamaica/healingemeraldwellness/team/alicia"

# Upload image from workspace root (relative path)
pnpm --filter @sovoli/sovoli.com exec -- pnpm with-env node scripts/upload-media.mjs "tmp/image.jpg" "o/private-schools/jamaica/st-elizabeth/littlefishkindergarten"

# Upload video from apps/sovoli.com directory
cd apps/sovoli.com
pnpm with-env node scripts/upload-media.mjs "E:\Developers\sovoli\tmp\video.mp4" "o/private-schools/jamaica/st-elizabeth/littlefishkindergarten"
```

**Important:** The script outputs two JSON objects:
1. "Full Cloudinary Response" - complete API response
2. "Media Object for JSON" - formatted object ready to add to media.json

## Step 3: Find the Organization's media.json File

**Location pattern:**
```
apps/sovoli.com/src/modules/data/organisations/<org-path-without-o-prefix>/media.json
```

**Example:**
- Org-path: `o/private-schools/jamaica/st-elizabeth/littlefishkindergarten`
- Media.json location: `apps/sovoli.com/src/modules/data/organisations/private-schools/jamaica/st-elizabeth/littlefishkindergarten/media.json`

**How to verify:**
- Use `glob_file_search` to find: `**/<org-name>/media.json`
- Or navigate: `apps/sovoli.com/src/modules/data/organisations/` + org-path without `o/` prefix

## Step 4: Add Media Entry to media.json

1. **Read the existing media.json** to understand the structure and ID naming pattern
2. **Extract the "Media Object for JSON"** from the upload script output
3. **Generate a unique ID** following the organization's naming pattern:
   - Common patterns: `<org-prefix>-gallery-<number>`, `<org-prefix>-video-<number>`, `<org-prefix>-photo-<number>`
   - Example: `lfk-gallery-3`, `lfk-video-1` (for littlefishkindergarten)
   - Check existing IDs in media.json to match the pattern
4. **Add the `id` field** to the media object
5. **Add the entry** to the `media` array in media.json

**Example structure:**
```json
{
  "media": [
    {
      "id": "lfk-gallery-3",
      "type": "image",
      "url": "https://res.cloudinary.com/...",
      "assetId": "...",
      "publicId": "...",
      "width": 1280,
      "height": 720,
      "format": "jpg",
      "bytes": 144475,
      "version": 1766583748
    },
    {
      "id": "lfk-video-1",
      "type": "video",
      "url": "https://res.cloudinary.com/...",
      "assetId": "...",
      "publicId": "...",
      "width": 464,
      "height": 832,
      "format": "mp4",
      "bytes": 3805211,
      "version": 1766583829,
      "duration": 38.034286,
      "videoCodec": "h264",
      "audioCodec": "aac",
      "fps": 30,
      "bitrate": 739488,
      "posterUrl": "https://res.cloudinary.com/..."
    }
  ]
}
```

## Step 5: Add Media IDs to Programs/Projects

1. **Find the program/project JSON file** (e.g., `nursery-academic.json`, `programs.json`)
2. **Locate the `media.galleryIds` array** for each program/project
3. **Add the new media IDs** to the `galleryIds` array

**Example:**
```json
{
  "programs": [
    {
      "id": "lfk-pre-nursery",
      "media": {
        "galleryIds": ["lfk-gallery-1", "lfk-gallery-2", "lfk-gallery-3", "lfk-video-1"]
      }
    }
  ]
}
```

**To reorder gallery items:**
- Simply rearrange the IDs in the `galleryIds` array
- The first item in the array appears first in the gallery
- Example: Move `"lfk-gallery-3"` to position 1: `["lfk-gallery-3", "lfk-gallery-1", "lfk-gallery-2", "lfk-video-1"]`

**Important:**
- Update ALL programs/projects that should include the new media
- Use `grep` to find all occurrences: `grep -r "galleryIds" <directory>`
- Maintain consistent ordering across related programs if desired

## Step 6: Verify Changes

1. **Check for linting errors**: `read_lints` on the modified files
2. **Verify JSON syntax** is valid
3. **Confirm all programs** that should include the media have been updated

## File Size Limitations

- **Cloudinary upload limit**: 100MB per file
- Files over 100MB will fail to upload even with the large file upload feature
- For files exceeding 100MB, compress them first or use Cloudinary's async upload API with a signed upload preset

