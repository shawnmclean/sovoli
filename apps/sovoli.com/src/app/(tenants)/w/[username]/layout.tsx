import { notFound } from "next/navigation";

import { orgs } from "~/modules/websites/data";
import { Footer } from "./components/Footer";
import { TenantNavbar } from "./components/navbar/TenantNavbar";

export function generateStaticParams() {
  return orgs.map((org) => ({
    username: org.slug,
  }));
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const org = orgs.find((org) => org.slug === username);
  if (!org) {
    notFound();
  }
  return {
    title: {
      absolute: org.title,
      template: `%s | ${org.name}`,
    },
    description: org.description,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: org.title,
      description: org.description,
      url: org.url,
      siteName: org.name,
      images: org.images,
    },
  };
}

export default async function Layout({ children, params }: Props) {
  const { username: _ } = await params;
  return (
    <div className="flex min-h-screen flex-col">
      <TenantNavbar />

      {children}

      <Footer />
    </div>
  );
}
