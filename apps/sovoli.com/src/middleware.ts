import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { bus } from "~/services/core/bus";
import { config as webConfig } from "~/utils/config";
import { GetUsernameByDomainQuery } from "./modules/websites/services/queries/GetUsernameByDomainQuery";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- 1. Skip static assets and internal paths ---
  if (isStaticAsset(pathname)) return NextResponse.next();

  const host = request.headers.get("host") ?? "";
  const hostname = host.toLowerCase();
  const isApiRoute = pathname.startsWith("/api/");
  const rootDomain = webConfig.rootDomain.replace(/^www\./, "").toLowerCase();
  console.log("rootDomain", rootDomain);
  console.log("hostname", hostname);
  if (isRootHost(hostname, rootDomain)) {
    return NextResponse.next();
  }

  // --- 2. Handle localhost / preview / production cases ---
  let tenant: string | null = null;

  if (isLocalhost(hostname)) {
    tenant = extractLocalTenant(request.url, hostname);
  } else if (isPreviewHost(hostname)) {
    tenant = extractPreviewTenant(hostname);
  } else {
    tenant = await resolveTenant(hostname);
  }

  // --- 3. If no tenant, return 404 ---
  if (!tenant) return new NextResponse(null, { status: 404 });

  // --- 4. Handle API routes separately (no rewrites) ---
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
  const hostname = host.split(":")[0];
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function isPreviewHost(host: string): boolean {
  return host.includes("---") && host.endsWith(".vercel.app");
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
  return host.split("---")[0] ?? null;
}

async function resolveTenant(hostname: string): Promise<string | null> {
  // Custom domain → lookup
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
