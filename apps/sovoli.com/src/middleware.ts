import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { bus } from "~/services/core/bus";
import { config as webConfig } from "~/utils/config";
import { GetWebsiteByCustomDomainQuery } from "./modules/websites/services/queries/GetWebsiteByCustomDomainQuery";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.url;

  // Skip rewriting for static assets (images, styles, js, etc.)
  if (
    pathname.startsWith("/ingest/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") || // Adjust this to your static asset paths
    pathname.startsWith("/api/") ||
    /\.(png|jpg|jpeg|svg|gif|ico|webp|avif|js|css|map|json)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  let subdomain: string | null | undefined = null;

  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    // Try to extract subdomain from the full URL for local development
    // This handles cases where browsers normalize the hostname
    const fullUrlMatch = /http:\/\/([^.]+)\.localhost/.exec(url);
    if (fullUrlMatch?.[1]) {
      subdomain = fullUrlMatch[1];
    } else {
      // Standard host header approach as fallback
      const host = request.headers.get("host") ?? "";
      const hostname = host.split(":")[0];

      if (hostname?.includes(".localhost")) {
        subdomain = hostname.split(".")[0];
      }
    }
  } else {
    // Production/non-localhost handling
    const host = request.headers.get("host") ?? "";
    const hostname = host.split(":")[0];
    const rootDomainFormatted = webConfig.rootDomain.split(":")[0];

    // Handle preview deployment URLs (tenant---branch-name.vercel.app)
    const isPreviewDeployment =
      hostname?.includes("---") && hostname.endsWith(".vercel.app");

    if (isPreviewDeployment) {
      // Extract subdomain from preview URL (format: tenant---branch-name.vercel.app)
      const parts = hostname?.split("---");
      if (parts && parts.length > 0) {
        subdomain = parts[0];
      }
    } else if (hostname && rootDomainFormatted) {
      const isRootDomain =
        hostname === rootDomainFormatted ||
        hostname === `www.${rootDomainFormatted}`;

      if (!isRootDomain) {
        subdomain = await resolveTenantFromHost(hostname, rootDomainFormatted);
      }
    }
  }

  // If we have a subdomain (either from regular URL or preview deployment)
  if (subdomain) {
    return NextResponse.rewrite(
      new URL(`/w/${subdomain}${pathname}`, request.url),
    );
  }

  // On the root domain, allow normal access
  return NextResponse.next();
}

export async function resolveTenantFromHost(
  hostname: string,
  rootDomain: string,
): Promise<string | null> {
  const isSubdomain =
    hostname.endsWith(`.${rootDomain}`) &&
    hostname !== rootDomain &&
    hostname !== `www.${rootDomain}`;

  if (isSubdomain) {
    return hostname.replace(`.${rootDomain}`, "");
  }

  const { orgMeta } = await bus.queryProcessor.execute(
    new GetWebsiteByCustomDomainQuery(hostname),
  );

  return orgMeta?.slug ?? null;
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /examples (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|examples|[\\w-]+\\.\\w+).*)",
  ],
};
