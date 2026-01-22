import { Command } from "commander";
import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { applyChangesCommand } from "./commands/apply-changes.js";
import { extractLeadsCommand } from "./commands/extract-leads.js";
import { matchLeadsCommand } from "./commands/match-leads.js";
import { metaAdsApplySpecCommand } from "./commands/meta-ads-apply-spec.js";
import { metaAdsCreateCampaignCommand } from "./commands/meta-ads-create-campaign.js";
import { metaOboSetupCommand } from "./commands/meta-obo-setup.js";
import { syncPosthogLeadsCommand } from "./commands/sync-posthog-leads.js";
import { uploadMediaCommand } from "./commands/upload-media.js";

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
program.addCommand(metaAdsCreateCampaignCommand);
program.addCommand(metaAdsApplySpecCommand);

program.parse();
