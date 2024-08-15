import "dotenv/config";

import { migrate } from "drizzle-orm/vercel-postgres/migrator";

import { db } from "../";

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("🚀 Migrations complete");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

await main();
