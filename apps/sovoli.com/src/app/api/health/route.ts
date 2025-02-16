import { db, sql } from "@sovoli/db";

export const dynamic = "force-dynamic";

interface DatabaseHealth {
  status: "ok" | "error" | "unknown";
  latency_ms: number | null;
  error?: string;
}

interface HealthStatus {
  status: "ok" | "error";
  database: DatabaseHealth;
}

export async function GET() {
  // health check for all systems
  // Systems:
  // - db
  // - auth
  // - storage
  // - analytics
  // - database
  // - AI Gateway (OpenAI, etc)

  const healthStatus: HealthStatus = {
    status: "ok",
    database: {
      status: "unknown",
      latency_ms: null,
    },
  };

  try {
    const dbStart = performance.now();
    await db.execute(sql`SELECT 1`);
    const dbEnd = performance.now();

    healthStatus.database = {
      status: "ok",
      latency_ms: Math.round(dbEnd - dbStart),
    };
  } catch (error) {
    healthStatus.database = {
      status: "error",
      latency_ms: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    healthStatus.status = "error";
  }

  return Response.json(healthStatus);
}
