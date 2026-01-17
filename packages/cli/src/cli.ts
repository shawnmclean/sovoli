import { Command } from "commander";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";
import { extractLeadsCommand } from "./commands/extract-leads.js";
import { uploadMediaCommand } from "./commands/upload-media.js";
import { matchLeadsCommand } from "./commands/match-leads.js";
import { applyChangesCommand } from "./commands/apply-changes.js";
import { syncPosthogLeadsCommand } from "./commands/sync-posthog-leads.js";
import { metaOboSetupCommand } from "./commands/meta-obo-setup.js";

// Load environment variables from root .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Path from packages/cli/dist/cli.js to root .env
const envPath = join(__dirname, "../../../.env");
dotenv.config({ path: envPath });

const program = new Command();

program
  .name("sovoli")
  .description("Sovoli CLI - Tools for managing data and media")
  .version("0.1.0");

// Add commands
program.addCommand(extractLeadsCommand);
program.addCommand(uploadMediaCommand);
program.addCommand(matchLeadsCommand);
program.addCommand(applyChangesCommand);
program.addCommand(syncPosthogLeadsCommand);
program.addCommand(metaOboSetupCommand);

program.parse();
