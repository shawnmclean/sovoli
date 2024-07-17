import { api } from "~/trpc/server";
import { db } from "@sovoli/db/client";
import { sql } from "drizzle-orm";

export async function GET() {
  // health check for all systems
  // Systems:
  // - db
  // - auth
  // - storage
  // - analytics
  // - database
  // - AI Gateway (OpenAI, etc)
  let trpcHealth, dbHealth;

  try {
    trpcHealth = await api.health.check();
  } catch (e) {
    trpcHealth = { status: "error", error: e };
  }
  try {
    // check round trip time to db health check
    const startTime = Date.now();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const dbResponse = await db.execute(sql`SELECT NOW()`);

    const endTime = Date.now();
    const roundTripTime = endTime - startTime;

    dbHealth = {
      status: "ok",
      roundTripTime: `${roundTripTime}ms`,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      dbTime: dbResponse?.rows?.[0]?.now,
    };
  } catch (e) {
    dbHealth = {
      status: "error",
      error: e instanceof Error ? e.message : String(e),
    };
  }

  const data = { status: "ok", trpc: trpcHealth, db: dbHealth };

  return Response.json(data);
}
