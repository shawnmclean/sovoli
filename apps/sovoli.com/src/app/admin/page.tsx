import { ORGS } from "~/modules/data/organisations";
import { TenantListWithStatus } from "./components/TenantListWithStatus";

interface TenantWithDomain {
  username: string;
  name: string;
  domain: string;
  url: string;
}

function getAllTenantsWithWebsiteModule(): TenantWithDomain[] {
  const tenants: TenantWithDomain[] = [];

  for (const org of ORGS) {
    if (!org.websiteModule?.website.domain) continue;

    const domain = org.websiteModule.website.domain;
    const url = org.websiteModule.website.url;

    tenants.push({
      username: org.org.username,
      name: org.org.name,
      domain,
      url,
    });
  }

  return tenants;
}

export default function AdminPage() {
  const tenants = getAllTenantsWithWebsiteModule();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Domain Status</h1>
          <p className="text-muted-foreground">
            {tenants.length} tenant{tenants.length !== 1 ? "s" : ""} with
            website modules
          </p>
        </div>

        <TenantListWithStatus tenants={tenants} />
      </div>
    </div>
  );
}
