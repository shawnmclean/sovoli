import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NavigationDrawer } from "~/app/(tenants)/w/[username]/components/NavigationDrawer";
import { MobileOnlyAlert } from "~/components/MobileOnlyAlert";
import { Footer } from "../../components/footer/Footer";
import { ServiceCTASection } from "./components/ServiceCTASection";
import { ServiceDescriptionSection } from "./components/ServiceDescriptionSection";
import { ServiceDetailsSection } from "./components/ServiceDetailsSection";
import { ServiceDetailMobileFooter } from "./components/footer/ServiceDetailMobileFooter";
import { ServiceDetailMobileNavbar } from "./components/navbar/ServiceDetailMobileNavbar";
import { ServiceHeroSection } from "./components/ServiceHeroSection";
import { getOrgInstanceWithService } from "./lib/getOrgInstanceWithService";

const retrieveOrgInstanceWithService = async (
  username: string,
  slug: string,
) => {
  const result = await getOrgInstanceWithService(username, slug);
  if (!result?.service) return notFound();

  return result as {
    orgInstance: typeof result.orgInstance;
    service: NonNullable<typeof result.service>;
  };
};

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string; slug: string }>;
  modals?: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, slug } = await params;
  const result = await retrieveOrgInstanceWithService(username, slug);

  const {
    orgInstance: {
      websiteModule: { website },
    },
    service,
  } = result;

  const serviceName = service.name;
  const serviceDescription = service.description;

  const ogImageUrl = service.media?.[0]?.url;

  return {
    title: serviceName,
    description: serviceDescription,
    openGraph: {
      title: `${serviceName} | ${website.siteName}`,
      description: serviceDescription,
      type: "website",
      images: [
        {
          url: ogImageUrl ?? "",
          width: 1200,
          height: 630,
          alt: serviceName,
        },
      ],
    },
  };
}

export default async function Layout({ children, params, modals }: Props) {
  const { username, slug } = await params;
  const { orgInstance, service } = await retrieveOrgInstanceWithService(
    username,
    slug,
  );

  if (!service) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ServiceDetailMobileNavbar orgInstance={orgInstance} service={service} />
      <MobileOnlyAlert />
      <NavigationDrawer fallbackPath={`/services/${service.slug}`}>
        {modals}
      </NavigationDrawer>

      <ServiceHeroSection
        orgInstance={orgInstance}
        service={service}
        username={username}
      />

      <div className="container mx-auto max-w-6xl px-4">
        <ServiceDescriptionSection service={service} />

        <ServiceDetailsSection service={service} />

        <ServiceCTASection service={service} orgInstance={orgInstance} />
      </div>

      <ServiceDetailMobileFooter orgInstance={orgInstance} service={service} />
      {children}

      <Footer orgInstance={orgInstance} />
    </div>
  );
}
