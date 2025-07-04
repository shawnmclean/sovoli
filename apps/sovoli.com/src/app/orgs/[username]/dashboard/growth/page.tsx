import { notFound } from "next/navigation";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { bus } from "~/services/core/bus";
import type { ContentConfig } from "./components/ContentItem";
import { ContentItem } from "./components/ContentItem";
import { EnrollmentFlier } from "./components/EnrollmentFlier";
import { EnrollmentSocial } from "./components/EnrollmentSocial";

const retreiveOrgInstance = async (username: string) => {
  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );
  if (!result.orgInstance) return notFound();
  return result.orgInstance;
};

const contentSizes = {
  standardPrint: {
    type: "print",
    name: "Standard Letter",
    width: 816, // 8.5 inches at 96 DPI
    height: 1056, // 11 inches at 96 DPI
  },
  facebookPortrait: {
    type: "social",
    name: "Facebook Portrait",
    width: 1440,
    height: 1800,
  },
} satisfies Record<string, ContentConfig>;

export default async function GrowthPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const orgInstance = await retreiveOrgInstance(username);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4">
      <ContentItem config={contentSizes.standardPrint}>
        <EnrollmentFlier orgInstance={orgInstance} />
      </ContentItem>
      <ContentItem config={contentSizes.facebookPortrait}>
        <EnrollmentSocial orgInstance={orgInstance} />
      </ContentItem>
    </div>
  );
}
