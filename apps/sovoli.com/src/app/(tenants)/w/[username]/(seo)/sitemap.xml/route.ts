import { getOrgInstanceByUsername } from "../../lib/getOrgInstanceByUsername";
import type { OrgInstance } from "~/modules/organisations/types";
import type { WorkforceMember } from "~/modules/workforce/types";
import type { Program } from "~/modules/academics/types";

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq:
    | "always"
    | "never"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly";
  priority: number;
}

function generateSitemapXml(urls: SitemapUrl[]): string {
  const urlset = urls
    .map(
      (url) => `
    <url>
      <loc>${url.loc}</loc>
      <lastmod>${url.lastmod}</lastmod>
      <changefreq>${url.changefreq}</changefreq>
      <priority>${url.priority}</priority>
    </url>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}
</urlset>`;
}

function generateWorkforceSitemapUrls(
  baseUrl: string,
  orgInstance: OrgInstance,
): SitemapUrl[] {
  const members = orgInstance.workforceModule?.members ?? [];

  return [
    {
      loc: `${baseUrl}/workforce/people`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly" as const,
      priority: 1,
    },
    ...members.map((member: WorkforceMember) => ({
      loc: `${baseUrl}/workforce/people/${member.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly" as const,
      priority: 0.8,
    })),
  ];
}

function generateAcademicsSitemapUrls(
  baseUrl: string,
  orgInstance: OrgInstance,
): SitemapUrl[] {
  const programs = orgInstance.academicModule?.programs ?? [];

  return [
    {
      loc: `${baseUrl}/academics/apply`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly" as const,
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/academics/programs`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly" as const,
      priority: 0.9,
    },
    ...programs.map((program: Program) => ({
      loc: `${baseUrl}/academics/programs/${program.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly" as const,
      priority: 0.8,
    })),
  ];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const orgInstance = await getOrgInstanceByUsername(username);

  if (!orgInstance) {
    return new Response("Organization not found", { status: 404 });
  }

  const baseUrl = `https://${orgInstance.websiteModule.website.domain}`;
  const sitemapUrls: SitemapUrl[] = [
    {
      loc: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: 1,
    },
    {
      loc: `${baseUrl}/about`,
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: 0.8,
    },
    ...generateWorkforceSitemapUrls(baseUrl, orgInstance),
    ...generateAcademicsSitemapUrls(baseUrl, orgInstance),
  ];

  const xml = generateSitemapXml(sitemapUrls);

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
