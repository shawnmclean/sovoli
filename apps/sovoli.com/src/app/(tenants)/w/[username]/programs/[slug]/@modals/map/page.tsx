import { MapDetails } from "../../components/location/MapDetails";
import { getOrgInstanceWithProgram } from "../../lib/getOrgInstanceWithProgram";

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

export default async function MapPage({ params }: Props) {
  const { username, slug } = await params;
  const result = await getOrgInstanceWithProgram(username, slug);

  if (!result) {
    return null;
  }

  const program = result.program ?? result.group?.programs?.[0];

  if (!program) {
    return null;
  }

  return <MapDetails orgInstance={result.orgInstance} program={program} />;
}
