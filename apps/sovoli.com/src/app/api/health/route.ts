export const dynamic = "force-dynamic";

interface HealthStatus {
	status: "ok";
	cold_start: boolean;
	function_latency_ms: number;
}

export function GET() {
	const functionStart = performance.now();
	const functionUptime = process.uptime(); // Detect if function restarted

	const healthStatus: HealthStatus = {
		status: "ok",
		cold_start: functionUptime < 1, // If uptime is low, it's a cold start
		function_latency_ms: 0,
	};

	// Track total function execution time
	const functionEnd = performance.now();
	healthStatus.function_latency_ms = Math.round(functionEnd - functionStart);

	return Response.json(healthStatus);
}
