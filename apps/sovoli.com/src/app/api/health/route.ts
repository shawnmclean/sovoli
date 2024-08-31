// import { helloWorld } from "@sovoli/api/trigger";
import { db } from "@sovoli/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  // health check for all systems
  // Systems:
  // - db
  // - auth
  // - storage
  // - analytics
  // - database
  // - AI Gateway (OpenAI, etc)
  let dbHealth;

  // await helloWorld.trigger({ message: "health check" });

  try {
    // check round trip time to db health check
    const startTime = Date.now();

    const dbResponse = await db.execute(sql`SELECT NOW()`);

    const endTime = Date.now();
    const roundTripTime = endTime - startTime;

    dbHealth = {
      status: "ok",
      roundTripTime: `${roundTripTime}ms`,
      dbTime: dbResponse.rows[0]?.now,
    };
  } catch (e) {
    dbHealth = {
      status: "error",
      error: e instanceof Error ? e.message : String(e),
    };
  }

  const data = { status: "ok", db: dbHealth };

  return Response.json(data);
}
