import { notFound } from "next/navigation";
import { Footer } from "~/components/footer/Footer";
import { bus } from "~/services/core/bus";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { SchoolHeader } from "./components/SchoolHeader";
import { SchoolNavigation } from "./components/SchoolNavigation";
import { config } from "~/utils/config";
import { OrgNavbar } from "./components/OrgNavbar/OrgNavbar";
import { Alert } from "@sovoli/ui/components/alert";

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
      absolute: `${orgInstance.org.name} | ${config.siteName}`,
      template: `%s | ${orgInstance.org.name} | ${config.siteName}`,
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

  return (
    <div className="flex min-h-screen flex-col">
      <OrgNavbar orgInstance={orgInstance} />
      <Alert
        className="hidden md:flex"
        variant="flat"
        color="warning"
        title="Website optimized for mobile devices. Use your phone please."
      />

      <main className="flex-grow">
        <SchoolHeader orgInstance={orgInstance} />

        <SchoolNavigation orgInstance={orgInstance} />

        <div className="w-full md:w-2/3">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
