import { getOrgInstanceWithProgram } from "../../lib/getOrgInstanceWithProgram";
import { CertificationDetails } from "../../components/certification/CertificationDetails";

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

export default async function CertificationPage({ params }: Props) {
  const { username, slug } = await params;
  const result = await getOrgInstanceWithProgram(username, slug);

  if (!result) {
    return null;
  }

  const program = result.program ?? result.group?.programs?.[0];

  if (!program) {
    return null;
  }

  return <CertificationDetails program={program} />;
}
