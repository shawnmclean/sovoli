# Lead Extraction Pipeline

## Usage

### Prerequisites

1. Install Gemini CLI:
   ```bash
   npm install -g @google/gemini-cli
   ```

2. Authenticate with Gemini CLI (run once):
   ```bash
   gemini
   ```
   This will open a browser to authenticate. Credentials are cached for future use.

   Alternatively, set an API key in your `.env` file:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

### Running the Script

**Default behavior** - Process all unprocessed images in the inputs directory (in parallel):
```bash
node scripts/extract-lead-entities.mjs
```

The script will:
- Read the registry to identify already-processed images
- Skip images that have been successfully processed
- Process remaining images in parallel
- Save extracted JSON files to `data/leads/extractions/`
- Update the registry to track processed images

Process specific image(s) (optional):
```bash
node scripts/extract-lead-entities.mjs "data/leads/inputs/images/IMG_6245.PNG"
```

## Directory Structure

```
data/leads/
├── inputs/images/     # Screenshots from localsend (gitignored)
├── extractions/       # Extracted JSON files (committed)
└── registry.json      # State tracking (gitignored)
```

## File Naming

- **Extracted JSON**: `{base-image-name}-extraction.json` (e.g., `IMG_6245-extraction.json`)
