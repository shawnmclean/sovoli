import { notFound } from "next/navigation";
import { GetAllWebsiteUsernamesQuery } from "~/modules/websites/services/queries/GetAllWebsiteUsernames";
import { bus } from "~/services/core/bus";
import { SearchContent } from "../components/search/SearchContent";
import { TeamSection } from "../components/TeamSection";
import { getOrgInstanceByUsername } from "../lib/getOrgInstanceByUsername";
import { OfferingContent } from "./components/OfferingContent";
import { OrgGalleryCarousel } from "./components/OrgGalleryCarousel";
import { OrgLandingSection } from "./components/OrgLandingSection";

const retreiveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

export async function generateStaticParams() {
  const result = await bus.queryProcessor.execute(
    new GetAllWebsiteUsernamesQuery(),
  );
  return result.usernames.map((username) => ({
    username,
  }));
}

export default async function WebsitePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const orgInstance = await retreiveOrgInstance(username);

  return (
    <>
      <OrgGalleryCarousel orgInstance={orgInstance} />

      <div className="container mx-auto max-w-6xl space-y-6 px-6 py-4">
        <OrgLandingSection orgInstance={orgInstance} />
        <SearchContent orgInstance={orgInstance} />
        <OfferingContent orgInstance={orgInstance} />
      </div>

      <TeamSection orgInstance={orgInstance} />
    </>
  );
}
