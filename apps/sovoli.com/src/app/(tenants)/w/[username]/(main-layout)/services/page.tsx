import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getOrgInstanceByUsername } from "../../lib/getOrgInstanceByUsername";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const {
    websiteModule: { website },
  } = await retrieveOrgInstance(username);

  return {
    title: "Services",
    description: `Services and offerings from ${website.siteName}.`,
    openGraph: {
      title: `Services | ${website.siteName}`,
      description: `Services and offerings from ${website.siteName}.`,
      type: "website",
      url: "/services",
      siteName: website.siteName,
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  const offeringsNavItem =
    orgInstance.websiteModule.website.header?.nav.find(
      (item) => item.key === "offerings",
    ) ?? null;

  // If tenant configured offerings to be an external URL (e.g. Fresha),
  // keep `/services` as a stable internal route that redirects out.
  if (offeringsNavItem?.url) {
    redirect(offeringsNavItem.url);
  }

  const services = orgInstance.serviceModule?.services ?? [];
  const siteName = orgInstance.websiteModule.website.siteName;

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-6 py-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Services</h1>
        <p className="text-sm text-foreground-500">
          Explore services and offerings from {siteName}.
        </p>
      </div>

      {services.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <Card key={service.url} className="bg-content1">
              <CardHeader className="flex flex-col items-start gap-1">
                <div className="text-base font-semibold text-foreground">
                  {service.name}
                </div>
                <div className="text-sm text-foreground-500">
                  {service.description}
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <Button
                  as={Link}
                  href={service.url}
                  color="primary"
                  variant="flat"
                  radius="full"
                >
                  Book / Learn more
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-content1">
          <CardHeader className="text-base font-semibold text-foreground">
            Services coming soon
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-foreground-500">
              We’re finalizing our services and will post details here shortly.
            </p>
            <Button
              as={Link}
              href="/contact"
              color="primary"
              variant="flat"
              radius="full"
            >
              Contact us
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
