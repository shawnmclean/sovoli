import { notFound } from "next/navigation";
import { Footer } from "~/components/footer/Footer";
import { bus } from "~/services/core/bus";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { config } from "~/utils/config";
import { MobileOnlyAlert } from "~/components/MobileOnlyAlert";
import { AdminSchoolHeader } from "./components/AdminSchoolHeader";
import { AdminSchoolNavigation } from "./components/AdminSchoolNavigation";

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
    description: `Admin page for ${orgInstance.org.name}`,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: orgInstance.org.name,
      description: `Profile page for ${orgInstance.org.name}`,
      url: `https://sovoli.com/${orgInstance.org.username}`,
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
      <MobileOnlyAlert />

      <main className="flex-grow">
        <AdminSchoolHeader orgInstance={orgInstance} />

        <AdminSchoolNavigation orgInstance={orgInstance} />

        <div className="w-full md:w-2/3">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
