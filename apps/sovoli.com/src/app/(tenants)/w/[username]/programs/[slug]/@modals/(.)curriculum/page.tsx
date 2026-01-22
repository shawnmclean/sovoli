import { CurriculumDetails } from "../../components/curriculum/CurriculumDetails";
import { getOrgInstanceWithProgram } from "../../lib/getOrgInstanceWithProgram";

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

export default async function CurriculumIntercept({ params }: Props) {
  const { username, slug } = await params;
  const result = await getOrgInstanceWithProgram(username, slug);

  if (!result) {
    return null;
  }

  const program = result.program ?? result.group?.programs?.[0];

  if (!program) {
    return null;
  }

  return <CurriculumDetails program={program} />;
}
