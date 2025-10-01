import { notFound } from "next/navigation";

import { bus } from "~/services/core/bus";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";

import { ProgramGroupListing } from "~/app/(tenants)/w/[username]/(main-layout)/components/ProgramGroupListing";
import { Alert } from "@sovoli/ui/components/alert";
import { Button } from "@sovoli/ui/components/button";
import { Link } from "@sovoli/ui/components/link";

const retrieveOrgInstance = async (username: string) => {
  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );
  if (!result.orgInstance) return notFound();
  return result.orgInstance;
};

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  const { org } = orgInstance;

  return (
    <div className="space-y-4 p-2 sm:p-4 max-w-4xl mx-auto">
      <ProgramGroupListing orgInstance={orgInstance} />

      <Alert
        hideIcon
        variant="faded"
        color="default"
        title="Are you the admin?"
        endContent={
          <Button
            as={Link}
            href={`/${org.username}/dashboard`}
            size="sm"
            variant="flat"
            color="default"
          >
            Manage Programs
          </Button>
        }
      />
    </div>
  );
}
