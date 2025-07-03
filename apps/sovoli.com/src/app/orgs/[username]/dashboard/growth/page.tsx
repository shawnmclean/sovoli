import { notFound } from "next/navigation";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { bus } from "~/services/core/bus";
import { ContentItem } from "./components/ContentItem";

const retreiveOrgInstance = async (username: string) => {
  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );
  if (!result.orgInstance) return notFound();
  return result.orgInstance;
};
export default async function GrowthPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const orgInstance = await retreiveOrgInstance(username);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4">
      <ContentItem orgInstance={orgInstance} />
    </div>
  );
}
