import { notFound } from "next/navigation";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { bus } from "~/services/core/bus";
import { ReceivablesChecklist } from "./components/ReceivablesChecklist";

const retrieveOrgInstance = async (username: string) => {
  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );
  if (!result.orgInstance) return notFound();
  return result.orgInstance;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  // This will be handled by the parent layout
  return [];
}

export default async function ReceivablesPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Information Needed</h1>
        <p className="text-sm text-default-500">
          Complete the items below to ensure your website displays all necessary
          information.
        </p>
      </div>

      <ReceivablesChecklist orgInstance={orgInstance} />
    </div>
  );
}
