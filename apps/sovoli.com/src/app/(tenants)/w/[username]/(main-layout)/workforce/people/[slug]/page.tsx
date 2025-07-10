import { notFound } from "next/navigation";
import { getOrgInstanceByUsername } from "../../../lib/getOrgInstanceByUsername";
import { WorkforcePersonProfile } from "./components/WorkforcePersonProfile";
import type { Metadata } from "next";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface WorkforcePersonPageProps {
  params: Promise<{ username: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: WorkforcePersonPageProps): Promise<Metadata> {
  const { username, slug } = await params;
  const {
    websiteModule: { website },
    workforceModule,
  } = await retrieveOrgInstance(username);

  const member = workforceModule?.members.find((m) => m.slug === slug);
  if (!member) return notFound();

  return {
    title: `${member.name} | Team Member`,
    description:
      member.bio ??
      `Learn more about ${member.name}, ${member.roleAssignments.map((p) => p.position.name).join(", ")} at ${website.siteName}.`,
    openGraph: {
      title: `${member.name} | ${website.siteName}`,
      description:
        member.bio ??
        `Learn more about ${member.name}, ${member.roleAssignments.map((p) => p.position.name).join(", ")} at ${website.siteName}.`,
      type: "profile",
    },
  };
}

export default async function WorkforcePersonPage({
  params,
}: WorkforcePersonPageProps) {
  const { username, slug } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  const member = orgInstance.workforceModule?.members.find(
    (m) => m.slug === slug,
  );
  if (!member) return notFound();

  return <WorkforcePersonProfile member={member} />;
}
