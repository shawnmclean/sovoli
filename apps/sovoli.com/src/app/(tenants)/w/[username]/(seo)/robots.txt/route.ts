import { getOrgInstanceByUsername } from "../../lib/getOrgInstanceByUsername";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const orgInstance = await getOrgInstanceByUsername(username);

  if (!orgInstance) {
    return new Response("Not Found", { status: 404 });
  }

  const baseUrl = orgInstance.websiteModule.website.url;

  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  const robotsXml = `
    User-agent: *
    Sitemap: ${sitemapUrl}
  `;

  return new Response(robotsXml, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
