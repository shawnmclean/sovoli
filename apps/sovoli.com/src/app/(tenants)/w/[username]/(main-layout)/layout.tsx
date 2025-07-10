import { notFound } from "next/navigation";

import { Footer } from "../components/footer/Footer";
import { TenantNavbar } from "../components/navbar/TenantNavbar";
import { getOrgInstanceByUsername } from "../lib/getOrgInstanceByUsername";
import { MobileFooter } from "../components/footer/MobileFooter";
import { Alert } from "@sovoli/ui/components/alert";

const retreiveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
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

export default async function Layout({ children, params }: Props) {
  const { username } = await params;
  const orgInstance = await retreiveOrgInstance(username);

  return (
    <div className="flex min-h-screen flex-col">
      <TenantNavbar orgInstance={orgInstance} />
      <Alert
        className="hidden md:flex"
        variant="flat"
        color="warning"
        title="Website optimized for mobile devices. Use your phone please."
        description="We're working on a better experience for desktop users."
      />
      {children}

      <Footer orgInstance={orgInstance} />
      <MobileFooter orgInstance={orgInstance} />
    </div>
  );
}
