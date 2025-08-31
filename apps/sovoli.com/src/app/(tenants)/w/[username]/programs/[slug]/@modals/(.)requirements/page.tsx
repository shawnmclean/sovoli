import { getOrgInstanceWithProgram } from "../../lib/getOrgInstanceWithProgram";
import { RequirementsModal } from "./Modal";
import type { Program } from "~/modules/academics/types";

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

export default async function RequirementsIntercept({ params }: Props) {
  const { username, slug } = await params;
  const result = await getOrgInstanceWithProgram(username, slug);

  if (!result) {
    return null;
  }

  const program = result.program || result.group?.programs?.[0];

  if (!program) {
    return null;
  }

  return <RequirementsModal program={program} />;
}
