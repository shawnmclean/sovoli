import { getOrgInstanceWithProject } from "../../lib/getOrgInstanceWithProject";
import { ProjectMetricsDetails } from "../../components/metrics/ProjectMetricsDetails";

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

export default async function MetricsPage({ params }: Props) {
  const { username, slug } = await params;
  const result = await getOrgInstanceWithProject(username, slug);

  if (!result?.project) {
    return null;
  }

  return <ProjectMetricsDetails project={result.project} />;
}
