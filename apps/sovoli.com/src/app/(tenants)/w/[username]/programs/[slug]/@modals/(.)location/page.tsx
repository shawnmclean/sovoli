import { getOrgInstanceWithProgram } from "../../lib/getOrgInstanceWithProgram";
import { LocationDetails } from "../../components/location/LocationDetails";

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

export default async function LocationIntercept({ params }: Props) {
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
    <LocationDetails orgInstance={result.orgInstance} program={program} />
  );
}

