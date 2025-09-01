import { getOrgInstanceWithProgram } from "../../lib/getOrgInstanceWithProgram";
import { RequirementDetails } from "../../components/RequirementDetails";
import { trackProgramAnalytics } from "../../lib/programAnalytics";

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

export default async function RequirementsPage({ params }: Props) {
  const { username, slug } = await params;
  const result = await getOrgInstanceWithProgram(username, slug);

  if (!result) {
    return null;
  }

  const program = result.program ?? result.group?.programs?.[0];

  if (!program) {
    return null;
  }

  trackProgramAnalytics("SectionOpened", program, null, {
    section: "requirements",
  });

  return <RequirementDetails program={program} />;
}
