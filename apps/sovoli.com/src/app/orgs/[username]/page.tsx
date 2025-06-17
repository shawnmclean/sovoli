import { notFound } from "next/navigation";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import { Chip } from "@sovoli/ui/components/chip";
import { GlobeIcon } from "lucide-react";
import { GetAllWebsiteUsernamesQuery } from "~/modules/websites/services/queries/GetAllWebsiteUsernames";
import { bus } from "~/services/core/bus";

import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { ContactMethods } from "../../(tenants)/w/[username]/components/ContactMethods";

const retreiveOrgInstance = async (username: string) => {
  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );
  if (!result.orgInstance) return notFound();
  return result.orgInstance;
};

export async function generateStaticParams() {
  //TODO: change query to get all org usernames
  const result = await bus.queryProcessor.execute(
    new GetAllWebsiteUsernamesQuery(),
  );
  return result.usernames.map((username) => ({
    username,
  }));
}

export default async function OrgProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const orgInstance = await retreiveOrgInstance(username);

  const websiteUrl =
    orgInstance.websiteModule?.website.url ??
    orgInstance.org.socialLinks?.find((l) => l.platform === "website")?.url ??
    null;

  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{orgInstance.org.name}</h1>

          {websiteUrl && (
            <div className="flex items-center gap-2">
              <GlobeIcon className="h-5 w-5 text-default-500" />
              <Link href={websiteUrl} isExternal showAnchorIcon>
                Visit Website
              </Link>
            </div>
          )}

          {orgInstance.org.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {orgInstance.org.categories.map((category) => (
                <Chip key={category} size="sm" variant="dot">
                  {category}
                </Chip>
              ))}
            </div>
          )}
        </div>

        {orgInstance.org.locations.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {orgInstance.org.locations.map((location, index) => (
              <Card key={location.key} className="p-6">
                <CardBody>
                  <h3 className="mb-4 text-xl font-semibold">
                    {location.label ?? `Location ${index + 1}`}
                  </h3>
                  <ContactMethods location={location} />
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-default-600">No contact information available.</p>
        )}
      </div>
    </section>
  );
}
