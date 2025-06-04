import { notFound } from "next/navigation";

import { Footer } from "./components/Footer";
import { TenantNavbar } from "./components/navbar/TenantNavbar";
import { getWebsiteByUsername } from "./lib/getWebsiteByUsername";

const retreiveWebsite = async (username: string) => {
  const result = await getWebsiteByUsername(username);
  if (!result) return notFound();
  return result;
};

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const { website } = await retreiveWebsite(username);

  return {
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
      url: website.url,
      siteName: website.siteName,
      images: website.images,
    },
  };
}

export default async function Layout({ children, params }: Props) {
  const { username } = await params;
  const { website, org } = await retreiveWebsite(username);
  return (
    <div className="flex min-h-screen flex-col">
      <TenantNavbar website={website} org={org} />
      {children}

      <Footer />
    </div>
  );
}
