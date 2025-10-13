import type { NextRequest } from "next/server";
import { getOrgInstanceByUsername } from "~/app/(tenants)/w/[username]/lib/getOrgInstanceByUsername";

export interface OrgInstanceContext {
  orgInstance: NonNullable<
    Awaited<ReturnType<typeof getOrgInstanceByUsername>>
  >;
  tenant: string;
}

type RouteHandler<T = unknown> = (
  request: T,
  context: OrgInstanceContext,
) => Promise<Response> | Response;

/**
 * Higher-order function that wraps API route handlers with automatic tenant resolution
 * and orgInstance injection.
 *
 * The tenant is extracted from the x-tenant header, which is set by middleware.ts
 *
 * @example
 * export const POST = withOrgInstance(async (request, { orgInstance, tenant }) => {
 *   // orgInstance is automatically available here
 *   const programs = orgInstance.academicModule?.programs ?? [];
 *   return Response.json({ programs });
 * });
 */
export function withOrgInstance<T extends Request | NextRequest = Request>(
  handler: RouteHandler<T>,
) {
  return async (request: T) => {
    // Extract tenant from middleware header (set in middleware.ts)
    const tenant = request.headers.get("x-tenant");

    if (!tenant) {
      return new Response("Tenant not found in request", { status: 400 });
    }

    // Get the organization instance
    const orgInstance = await getOrgInstanceByUsername(tenant);

    if (!orgInstance) {
      return new Response("Organization not found", { status: 404 });
    }

    // Call the handler with the orgInstance context
    return handler(request, { orgInstance, tenant });
  };
}
