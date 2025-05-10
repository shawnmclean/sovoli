export default async function SubdomainPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  return <div>Subdomain Page: {subdomain}</div>;
}
