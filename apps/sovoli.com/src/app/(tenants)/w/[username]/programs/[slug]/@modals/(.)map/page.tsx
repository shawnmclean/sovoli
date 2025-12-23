import { getOrgInstanceWithProgram } from "../../lib/getOrgInstanceWithProgram";
import { MapDetails } from "../../components/location/MapDetails";

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

export default async function MapIntercept({ params }: Props) {
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
    <MapDetails orgInstance={result.orgInstance} program={program} />
  );
}

