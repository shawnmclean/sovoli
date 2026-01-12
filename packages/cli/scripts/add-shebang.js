import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "../dist");
const cliFile = path.join(distDir, "cli.js");

if (fs.existsSync(cliFile)) {
  const content = fs.readFileSync(cliFile, "utf-8");
  if (!content.startsWith("#!/usr/bin/env node\n")) {
    fs.writeFileSync(cliFile, "#!/usr/bin/env node\n" + content);
  }
}
