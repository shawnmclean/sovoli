import { Command } from "commander";
import { extractLeadsCommand } from "./commands/extract-leads.js";
import { uploadMediaCommand } from "./commands/upload-media.js";

const program = new Command();

program
  .name("sovoli")
  .description("Sovoli CLI - Tools for managing data and media")
  .version("0.1.0");

// Add commands
program.addCommand(extractLeadsCommand);
program.addCommand(uploadMediaCommand);

program.parse();
