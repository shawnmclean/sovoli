import { notFound } from "next/navigation";

import { Footer } from "./components/Footer";
import { TenantNavbar } from "./components/navbar/TenantNavbar";
import { getOrgInstanceByUsername } from "./lib/getOrgInstanceByUsername";

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
  const orgInstance = await retreiveOrgInstance(username);
  return (
    <div className="flex min-h-screen flex-col">
      <TenantNavbar orgInstance={orgInstance} />
      {children}

      <Footer />
    </div>
  );
}
