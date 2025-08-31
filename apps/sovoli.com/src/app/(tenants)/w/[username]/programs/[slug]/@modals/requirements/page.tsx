import { NavigationDrawer } from "~/app/(tenants)/w/[username]/components/NavigationDrawer";
import { getOrgInstanceWithProgram } from "../../lib/getOrgInstanceWithProgram";

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

export default async function RequirementsPage({ params }: Props) {
  const { username, slug } = await params;
  const result = await getOrgInstanceWithProgram(username, slug);

  if (!result) {
    return null;
  }

  const program = result.program || result.group?.programs?.[0];

  if (!program) {
    return null;
  }

  return (
    <h2>
      Requirements for{" "}
      {program.name ??
        program.standardProgramVersion?.program.name ??
        "Program"}
    </h2>
  );
}
