import { getOrgInstanceWithProject } from "../../../lib/getOrgInstanceWithProject";
import { ProjectPhaseDetails } from "../../../components/phases/ProjectPhaseDetails";

interface Props {
  params: Promise<{ username: string; slug: string; phaseSlug: string }>;
}

export default async function PhaseIntercept({ params }: Props) {
  const { username, slug, phaseSlug } = await params;
  const result = await getOrgInstanceWithProject(username, slug);

  if (!result?.project) {
    return null;
  }

  return <ProjectPhaseDetails project={result.project} phaseSlug={phaseSlug} />;
}

