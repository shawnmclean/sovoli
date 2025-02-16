import { db, sql } from "@sovoli/db";

export const dynamic = "force-dynamic";

interface DatabaseHealth {
  status: "ok" | "error" | "unknown";
  latency_ms: number | null;
  error?: string;
}

interface HealthStatus {
  count: number;
  status: "ok" | "error";
  cold_start: boolean;
  function_latency_ms: number;
  database: DatabaseHealth;
}

let count = 0;

export async function GET() {
  const functionStart = performance.now();
  const functionUptime = process.uptime(); // Detect if function restarted

  const healthStatus: HealthStatus = {
    count: count++,
    status: "ok",
    cold_start: functionUptime < 1, // If uptime is low, it's a cold start
    function_latency_ms: 0,
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

  // Track total function execution time
  const functionEnd = performance.now();
  healthStatus.function_latency_ms = Math.round(functionEnd - functionStart);

  return Response.json(healthStatus);
}
