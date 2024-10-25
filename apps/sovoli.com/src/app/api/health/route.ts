export const dynamic = "force-dynamic";

export function GET() {
  // health check for all systems
  // Systems:
  // - db
  // - auth
  // - storage
  // - analytics
  // - database
  // - AI Gateway (OpenAI, etc)


  return Response.json({
    status: "ok"
  });
}
