import { notFound } from "next/navigation";

import { GetAllWebsiteUsernamesQuery } from "~/modules/websites/services/queries/GetAllWebsiteUsernames";
import { bus } from "~/services/core/bus";

import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";

import { Link } from "@sovoli/ui/components/link";
import { GlobeIcon, PhoneIcon, MailIcon, MapPinIcon } from "lucide-react";
import { countryCodeToName } from "~/utils/countryUtils";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";

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

  const primaryLocation = orgInstance.org.locations[0];
  const phone = primaryLocation?.contacts.find(
    (c) => c.type === "phone",
  )?.value;
  const email = primaryLocation?.contacts.find(
    (c) => c.type === "email",
  )?.value;
  const whatsapp = primaryLocation?.contacts.find(
    (c) => c.type === "whatsapp",
  )?.value;

  return (
    <div>
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 p-4 md:flex-row">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Contact Section */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              {websiteUrl && (
                <Link
                  href={websiteUrl}
                  isExternal
                  className="flex items-center gap-2 text-default-600 hover:text-primary-500"
                >
                  <GlobeIcon className="text-base" />
                  <span className="text-sm">{websiteUrl}</span>
                </Link>
              )}
              {phone && (
                <Link
                  href={`tel:${phone}`}
                  className="flex items-center gap-2 text-default-600 hover:text-primary-500"
                >
                  <PhoneIcon className="text-base" />
                  <span className="text-sm">{phone}</span>
                </Link>
              )}
              {whatsapp && (
                <Link
                  href={`https://wa.me/${whatsapp}`}
                  className="flex items-center gap-2 text-default-600 hover:text-primary-500"
                >
                  <SiWhatsapp className="text-base" />
                  <span className="text-sm">{whatsapp}</span>
                </Link>
              )}
              {email && (
                <Link
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-default-600 hover:text-primary-500"
                >
                  <MailIcon className="text-base" />
                  <span className="text-sm">{email}</span>
                </Link>
              )}
              {primaryLocation?.address && (
                <div className="flex items-center gap-2 text-default-600">
                  <MapPinIcon className="text-base" />
                  <span className="text-sm">
                    {[
                      primaryLocation.address.line1,
                      primaryLocation.address.line2,
                      primaryLocation.address.city,
                      primaryLocation.address.state,
                      primaryLocation.address.postalCode,
                      countryCodeToName(primaryLocation.address.countryCode),
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Categories Section */}
          {orgInstance.org.categories.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {orgInstance.org.categories.map((category) => (
                  <Link
                    key={category}
                    color="foreground"
                    className="rounded-full bg-default-100 px-3 py-1 text-sm"
                    href={`/d/${category.toLowerCase()}/${countryCodeToName(primaryLocation?.address.countryCode ?? "")}`}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
