import { getOrgInstanceWithProgram } from "../../lib/getOrgInstanceWithProgram";
import { PriceDetails } from "../../components/footer/price/PriceDetails";

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

export default async function PricePage({ params }: Props) {
  const { username, slug } = await params;
  const result = await getOrgInstanceWithProgram(username, slug);

  if (!result) {
    return null;
  }

  const program = result.program ?? result.group?.programs?.[0];

  if (!program) {
    return null;
  }

  return <PriceDetails orgInstance={result.orgInstance} program={program} />;
}
