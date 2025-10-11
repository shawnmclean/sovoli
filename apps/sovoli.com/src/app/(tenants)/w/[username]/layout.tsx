import { notFound } from "next/navigation";
import { getOrgInstanceByUsername } from "./lib/getOrgInstanceByUsername";
import type { Organization, WithContext } from "schema-dts";
import { GeneralNavigationDrawer } from "./components/GeneralNavigationDrawer";

const retreiveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};
interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
  modals: React.ReactNode;
}
export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const {
    websiteModule: { website },
  } = await retreiveOrgInstance(username);

  return {
    metadataBase: new URL(website.url),
    title: {
      absolute: website.title,
      template: `%s | ${website.siteName}`,
    },
    description: website.description,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: website.title,
      description: website.description,
      url: "/",
      siteName: website.siteName,
      images: website.images,
    },
  };
}

export default async function Layout({ children, params, modals }: Props) {
  const { username } = await params;
  const orgInstance = await retreiveOrgInstance(username);

  // Build Organization structured data - this will be the base organization info
  // Program-specific pages will have their own EducationalOccupationalProgram schema
  const organizationSchema: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${orgInstance.websiteModule.website.url}#org`,
    name: orgInstance.org.name,
    url: orgInstance.websiteModule.website.url,
    ...(orgInstance.org.logo && {
      logo: orgInstance.org.logo,
    }),
    ...(orgInstance.websiteModule.website.description && {
      description: orgInstance.websiteModule.website.description,
    }),
    ...(orgInstance.org.locations.length > 0 && {
      address: orgInstance.org.locations.map((location) => ({
        "@type": "PostalAddress" as const,
        ...(location.address.line1 && {
          streetAddress: location.address.line1,
        }),
        ...(location.address.city && {
          addressLocality: location.address.city,
        }),
        ...(location.address.state && {
          addressRegion: location.address.state,
        }),
        ...(location.address.postalCode && {
          postalCode: location.address.postalCode,
        }),
        addressCountry: location.address.countryCode,
      })),
    }),
    ...(orgInstance.org.socialLinks &&
      orgInstance.org.socialLinks.length > 0 && {
        sameAs: orgInstance.org.socialLinks.map((link) => link.url),
      }),
    ...(orgInstance.org.categories.length > 0 && {
      additionalType:
        orgInstance.org.categories[0] === "private-school"
          ? "https://schema.org/School"
          : orgInstance.org.categories[0] === "nursery-school"
            ? "https://schema.org/Preschool"
            : orgInstance.org.categories[0] === "vocational-school"
              ? "https://schema.org/CollegeOrUniversity"
              : "https://schema.org/EducationalOrganization",
    }),
    ...(orgInstance.academicModule?.programs &&
      orgInstance.academicModule.programs.length > 0 && {
        hasOfferingCatalog: {
          "@type": "OfferingCatalog",
          name: "Educational Programs",
          itemListElement: orgInstance.academicModule.programs.map(
            (program) => ({
              "@id": `${orgInstance.websiteModule.website.url}/programs/${program.slug}`,
            }),
          ),
        },
      }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema, null, 0),
        }}
      />
      {children}
      <GeneralNavigationDrawer fallbackPath="/">
        {modals}
      </GeneralNavigationDrawer>
    </>
  );
}
