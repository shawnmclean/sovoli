import { notFound } from "next/navigation";
import { Footer } from "~/components/footer/Footer";
import { bus } from "~/services/core/bus";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import {
  GetUserKnowledgeByUsernameQuery,
  GetUserKnowledgeByUsernameQueryHandler,
} from "~/modules/notes/services/GetUserKnowledgeByUsername";
import { SchoolHeader } from "./components/SchoolHeader";
import { SchoolNavigation } from "./components/SchoolNavigation";
import { config } from "~/utils/config";
import { OrgNavbar } from "./components/OrgNavbar/OrgNavbar";
import { Alert } from "@sovoli/ui/components/alert";
import { OrgDetailMobileFooter } from "./components/OrgFooter/OrgDetailMobileFooter";
import { UserKnowledgeProfile } from "./components/UserKnowledgeProfile";

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

  // First check for user knowledge
  const userKnowledgeHandler = new GetUserKnowledgeByUsernameQueryHandler();
  const userKnowledgeResult = await userKnowledgeHandler.handle(
    new GetUserKnowledgeByUsernameQuery(username),
  );

  if (userKnowledgeResult.userKnowledge) {
    const { knowledgeItems } = userKnowledgeResult.userKnowledge;
    const totalItems = knowledgeItems.length;

    return {
      title: `${username}'s Knowledge`,
      description: `Browse ${username}'s collection of ${totalItems} knowledge items including notes, books, and collections.`,
      openGraph: {
        title: `${username}'s Knowledge`,
        description: `Browse ${username}'s collection of ${totalItems} knowledge items including notes, books, and collections.`,
        url: `${config.url}/${username}`,
        siteName: config.siteName,
        images: config.images,
      },
    };
  }

  // If no user knowledge, get org instance
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

  // First check for user knowledge
  const userKnowledgeHandler = new GetUserKnowledgeByUsernameQueryHandler();
  const userKnowledgeResult = await userKnowledgeHandler.handle(
    new GetUserKnowledgeByUsernameQuery(username),
  );

  if (userKnowledgeResult.userKnowledge) {
    // Render user knowledge profile with simple layout
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  // If no user knowledge, get org instance and render org layout
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
      <OrgDetailMobileFooter orgInstance={orgInstance} />
    </div>
  );
}
