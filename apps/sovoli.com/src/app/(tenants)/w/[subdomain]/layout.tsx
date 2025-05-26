import { notFound } from "next/navigation";

import { orgs } from "../data";
import { Footer } from "./components/Footer";
import { TenantNavbar } from "./components/navbar/TenantNavbar";

export function generateStaticParams() {
  return orgs.map((org) => ({
    subdomain: org.slug,
  }));
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { subdomain } = await params;
  const org = orgs.find((org) => org.slug === subdomain);
  if (!org) {
    notFound();
  }
  return {
    title: {
      absolute: org.name,
      template: `%s | ${org.name}`,
    },
    description: org.description,
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function Layout({ children, params }: Props) {
  const { subdomain } = await params;
  return (
    <div className="flex min-h-screen flex-col">
      <TenantNavbar />

      {children}
      {subdomain}
      <Footer />
    </div>
  );
}
