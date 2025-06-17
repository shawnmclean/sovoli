import { notFound } from "next/navigation";
import { Navbar } from "~/components/navbar/Navbar";
import { Footer } from "~/components/footer/Footer";
import { bus } from "~/services/core/bus";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { Avatar } from "@sovoli/ui/components/avatar";
import {
  CheckCircleIcon,
  GlobeIcon,
  PhoneIcon,
  MailIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { Tooltip } from "@sovoli/ui/components/tooltip";
import { Link } from "@sovoli/ui/components/link";
import { Button } from "@sovoli/ui/components/button";

const retreiveOrgInstance = async (username: string) => {
  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );
  if (!result.orgInstance) return notFound();
  return result.orgInstance;
};

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const orgInstance = await retreiveOrgInstance(username);

  return {
    title: {
      absolute: orgInstance.org.name,
      template: `%s | ${orgInstance.org.name}`,
    },
    description: `Profile page for ${orgInstance.org.name}`,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: orgInstance.org.name,
      description: `Profile page for ${orgInstance.org.name}`,
      url: `https://sovoli.com/orgs/${orgInstance.org.username}`,
      siteName: orgInstance.org.name,
      images: orgInstance.org.logo,
    },
  };
}

export default async function Layout({ children, params }: Props) {
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

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="w-full md:w-1/3">
          <Button
            as="a"
            href={`/d/${orgInstance.org.categories[0]?.toLowerCase()}/${primaryLocation?.address.country.toLowerCase()}`}
            variant="light"
            startContent={<ArrowLeftIcon className="w-4 h-4" />}
            size="sm"
          >
            Directory
          </Button>
        </div>
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 p-4 md:flex-row">
          <div className="w-full md:w-1/3">
            <div className="flex items-center gap-4 mb-6">
              <Avatar
                src={orgInstance.org.logo}
                name={orgInstance.org.name}
                size="lg"
                className="h-20 w-20"
              />
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold line-clamp-2">
                    {orgInstance.org.name}
                  </h1>
                  {orgInstance.org.isVerified && (
                    <Tooltip content="This organization has been verified by Sovoli">
                      <CheckCircleIcon className="w-5 h-5 text-success shrink-0" />
                    </Tooltip>
                  )}
                </div>
                {orgInstance.org.locations[0]?.address.city && (
                  <p className="text-sm text-default-500 capitalize mt-1">
                    {orgInstance.org.locations[0].address.city}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Section */}
            <div className="mb-6 flex flex-col gap-2">
              <div className="flex flex-wrap gap-4">
                {websiteUrl && (
                  <Link
                    href={websiteUrl}
                    isExternal
                    className="flex items-center gap-2 text-default-600 hover:text-primary-500"
                  >
                    <GlobeIcon className="h-4 w-4" />
                    <span className="text-sm">{websiteUrl}</span>
                  </Link>
                )}
                {phone && (
                  <Link
                    href={`tel:${phone}`}
                    className="flex items-center gap-2 text-default-600 hover:text-primary-500"
                  >
                    <PhoneIcon className="h-4 w-4" />
                    <span className="text-sm">{phone}</span>
                  </Link>
                )}
                {email && (
                  <Link
                    href={`mailto:${email}`}
                    className="flex items-center gap-2 text-default-600 hover:text-primary-500"
                  >
                    <MailIcon className="h-4 w-4" />
                    <span className="text-sm">{email}</span>
                  </Link>
                )}
              </div>

              {orgInstance.org.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {orgInstance.org.categories.map((category) => (
                    <Link
                      key={category}
                      color="foreground"
                      className="rounded-full bg-default-100 px-3 py-1 text-sm"
                      href={`/d/${category.toLowerCase()}/${primaryLocation?.address.country.toLowerCase()}`}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="w-full md:w-2/3">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
