import { getOrgInstanceByUsername } from "../../lib/getOrgInstanceByUsername";

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
    {
      loc: `${baseUrl}/workforce/people`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: 1,
    },
    // Add more URLs based on the website module's pages if needed
  ];

  const xml = generateSitemapXml(sitemapUrls);

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
