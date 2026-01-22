import { LocationFeaturesDetails } from "../../components/locationFeatures/LocationFeaturesDetails";
import { getOrgInstanceWithProgram } from "../../lib/getOrgInstanceWithProgram";

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

export default async function LocationFeaturesIntercept({ params }: Props) {
  const { username, slug } = await params;
  const result = await getOrgInstanceWithProgram(username, slug);

  if (!result) {
    return null;
  }

  const program = result.program ?? result.group?.programs?.[0];
  const orgInstance = result.orgInstance;

  if (!program) {
    return null;
  }

  return (
    <LocationFeaturesDetails orgInstance={orgInstance} program={program} />
  );
}
