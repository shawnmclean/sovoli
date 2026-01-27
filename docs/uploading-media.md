# Uploading Media Files and Adding to Programs

**Always use the upload script instead of MCP tools** for uploading media to Cloudinary. Follow these exact steps:

## Step 1: Determine the Organization Path

**⚠️ IMPORTANT: Required Path Format**

All media files MUST follow the direct tenant path format: `o/<tenant-username>/...`

**The `<org-path>` parameter MUST follow this pattern:**
```
o/<tenant-username>/[subdirectories]
```

**How to find the tenant username:**
1. Look at the organization's `org.json` file
2. Find the `username` field (e.g., `"username": "healingemeraldwellness"`)
3. Use that username directly in the path

**Examples of correct paths:**
- Base path: `o/healingemeraldwellness`
- With subdirectories: `o/healingemeraldwellness/team/alicia`
- Programs: `o/healingemeraldwellness/programs/massage-therapy`
- Services: `o/healingemeraldwellness/services/swedish-massage`
- Gallery: `o/healingemeraldwellness/gallery`

**Common subdirectories:**
- Team member photos/certificates: `o/<tenant-username>/team/<member-name>`
- Programs: `o/<tenant-username>/programs/<program-name>`
- Services: `o/<tenant-username>/services/<service-name>`
- Gallery: `o/<tenant-username>/gallery`

**❌ DO NOT USE the old category-based format:**
- ❌ `o/vocational-school/jamaica/healingemeraldwellness/...` (old format - deprecated)
- ❌ `o/private-schools/jamaica/st-elizabeth/littlefishkindergarten/...` (old format - deprecated)
- ✅ `o/healingemeraldwellness/...` (correct format)
- ✅ `o/littlefishkindergarten/...` (correct format)

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
- Base organization path: `o/<tenant-username>` (e.g., `o/healingemeraldwellness`)
- With subdirectories: `o/<tenant-username>/<subdirectory>` (e.g., `o/healingemeraldwellness/team/alicia`)

**Examples:**
```bash
# Upload image from workspace root (absolute path) - using direct tenant path
pnpm --filter @sovoli/sovoli.com exec -- pnpm with-env node scripts/upload-media.mjs "E:\Developers\sovoli\tmp\spa-standards.png" "o/healingemeraldwellness/team/alicia"

# Upload image from workspace root (relative path) - using direct tenant path
pnpm --filter @sovoli/sovoli.com exec -- pnpm with-env node scripts/upload-media.mjs "tmp/image.jpg" "o/littlefishkindergarten"

# Upload video from apps/sovoli.com directory - using direct tenant path
cd apps/sovoli.com
pnpm with-env node scripts/upload-media.mjs "E:\Developers\sovoli\tmp\video.mp4" "o/littlefishkindergarten/programs"
```

**Important:** The script outputs two JSON objects:
1. "Full Cloudinary Response" - complete API response
2. "Media Object for JSON" - formatted object ready to add to media.json

## Step 3: Find the Organization's media.json File

**Location pattern:**
```
apps/sovoli.com/src/modules/data/organisations/<category>/<country>/<region>/<tenant-name>/media.json
```

**Note:** The file system path still uses the category-based structure, but the Cloudinary path uses the direct tenant format.

**Example:**
- Tenant username: `littlefishkindergarten`
- Cloudinary org-path: `o/littlefishkindergarten` (for uploads)
- Media.json location: `apps/sovoli.com/src/modules/data/organisations/private-schools/jamaica/st-elizabeth/littlefishkindergarten/media.json` (file system)

**How to verify:**
- Use `glob_file_search` to find: `**/<tenant-name>/media.json`
- Or navigate: `apps/sovoli.com/src/modules/data/organisations/` + find the tenant's directory

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

