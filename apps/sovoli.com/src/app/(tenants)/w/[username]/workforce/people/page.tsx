import { getOrgInstanceByUsername } from "../../lib/getOrgInstanceByUsername";
import { TeamDirectory } from "./components/TeamDirectory";

interface TeamPageProps {
  params: Promise<{ username: string }>;
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { username } = await params;
  const orgInstance = await getOrgInstanceByUsername(username);

  return <TeamDirectory orgInstance={orgInstance} />;
}
