import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { bus } from "~/services/core/bus";
import { config as webConfig } from "~/utils/config";
import { GetUsernameByDomainQuery } from "./modules/websites/services/queries/GetUsernameByDomainQuery";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- 1. Skip static assets and internal paths ---
  if (isStaticAsset(pathname)) return NextResponse.next();

  // --- 1a. Guard admin routes with PIN cookie ---
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin") {
      return NextResponse.next();
    }

    const cookie = request.cookies.get("sovoli_admin_pin")?.value;
    if (cookie === "ok") {
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const host = request.headers.get("host") ?? "";
  const hostname = host.toLowerCase();
  const isApiRoute = pathname.startsWith("/api/");
  const rootDomain = webConfig.rootDomain.replace(/^www\./, "").toLowerCase();

  // --- 2. Handle preview hosts (check before root domain check) ---
  if (isPreviewHost(hostname)) {
    // Check for tenant in query parameter first
    const tenantFromQuery = extractTenantFromQuery(
      request.nextUrl.searchParams,
    );

    // Try to get tenant from query param or hostname (for old format)
    const tenant = tenantFromQuery ?? extractPreviewTenant(hostname);

    // If no tenant found, serve root domain content
    if (!tenant) {
      return NextResponse.next();
    }

    // Handle API routes separately (no rewrites)
    if (isApiRoute) {
      const res = NextResponse.next();
      res.headers.set("x-tenant", tenant);
      res.headers.set("vary", "host");
      return res;
    }

    const rewritten = NextResponse.rewrite(
      new URL(`/w/${tenant}${pathname}${request.nextUrl.search}`, request.url),
    );
    rewritten.headers.set("x-tenant", tenant);
    rewritten.headers.set("vary", "host");
    return rewritten;
  }

  if (isRootHost(hostname, rootDomain)) {
    return NextResponse.next();
  }

  // --- 3. Handle localhost / production cases ---
  let tenant: string | null = null;

  if (isLocalhost(hostname)) {
    tenant = extractLocalTenant(request.url, hostname);
    // If no tenant from subdomain, try query parameter
    tenant ??= extractTenantFromQuery(request.nextUrl.searchParams);
    // If still no tenant on localhost, allow access to directory/landing page
    if (!tenant) {
      return NextResponse.next();
    }
  } else {
    tenant = await resolveTenant(hostname);
  }

  // --- 4. If no tenant, return 404 ---
  if (!tenant) return new NextResponse(null, { status: 404 });

  // --- 5. Handle API routes separately (no rewrites) ---
  if (isApiRoute) {
    const res = NextResponse.next();
    res.headers.set("x-tenant", tenant);
    res.headers.set("vary", "host");
    return res;
  }

  const rewritten = NextResponse.rewrite(
    new URL(`/w/${tenant}${pathname}${request.nextUrl.search}`, request.url),
  );
  rewritten.headers.set("x-tenant", tenant);
  rewritten.headers.set("vary", "host");
  return rewritten;
}

function isStaticAsset(path: string): boolean {
  return (
    path.startsWith("/_next/") ||
    path.startsWith("/ingest/") ||
    path.startsWith("/images/") ||
    /\.(png|jpg|jpeg|svg|gif|ico|webp|avif|js|css|map|json)$/i.test(path)
  );
}

function isLocalhost(host: string): boolean {
  const hostname = host.split(":")[0] ?? host;
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".localhost") ||
    isLocalIp(hostname)
  );
}

function isLocalIp(hostname: string): boolean {
  const localIpPattern = /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/;
  return localIpPattern.test(hostname);
}

function isPreviewHost(host: string): boolean {
  // Old format: contains --- and ends with .vercel.app
  if (host.includes("---") && host.endsWith(".vercel.app")) return true;
  // New format: contains -git- and ends with .vercel.app
  if (host.includes("-git-") && host.endsWith(".vercel.app")) return true;
  return false;
}

function isRootHost(host: string, rootDomain: string): boolean {
  return host === rootDomain || host === `www.${rootDomain}`;
}

function extractLocalTenant(url: string, host: string): string | null {
  const match = /https?:\/\/([^.]+)\.localhost/.exec(url);
  if (match?.[1]) return match[1];
  const hostname = host.split(":")[0];
  if (hostname?.includes(".localhost")) return hostname.split(".")[0] ?? null;
  return null;
}

function extractPreviewTenant(host: string): string | null {
  // Old format: tenant is before --- separator
  if (host.includes("---")) {
    return host.split("---")[0] ?? null;
  }
  // New format: tenant comes from query parameter, not hostname
  // This function is only called as fallback, so return null for new format
  return null;
}

function extractTenantFromQuery(searchParams: URLSearchParams): string | null {
  const tenant = searchParams.get("tenant");
  return tenant ? tenant.toLowerCase() : null;
}

async function resolveTenant(hostname: string): Promise<string | null> {
  // Check if hostname matches tenant-name.sovoli.com pattern
  const sovoliSubdomainMatch = /^([^.]+)\.sovoli\.com$/.exec(hostname);
  if (sovoliSubdomainMatch?.[1]) {
    return sovoliSubdomainMatch[1].toLowerCase();
  }

  // Custom domain → lookup via query
  const { username } = await bus.queryProcessor.execute(
    new GetUsernameByDomainQuery(hostname),
  );
  return username ?? null;
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /_next (Next.js internals)
     * 2. /examples (inside /public)
     * 3. all root files inside /public (e.g. /favicon.ico)
     */
    "/sitemap.xml",
    "/robots.txt",
    "/api/:path*",
    "/((?!_next|examples|[\\w-]+\\.\\w+).*)",
  ],
};
