import { OrgHighlightsDetails } from "../../components/orgHighlights/OrgHighlightsDetails";
import { getOrgInstanceWithProgram } from "../../lib/getOrgInstanceWithProgram";

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

export default async function OrgHighlightsPage({ params }: Props) {
  const { username, slug } = await params;
  const result = await getOrgInstanceWithProgram(username, slug);

  if (!result) {
    return null;
  }

  const program = result.program ?? result.group?.programs?.[0];

  if (!program) {
    return null;
  }

  return (
    <OrgHighlightsDetails orgInstance={result.orgInstance} program={program} />
  );
}
