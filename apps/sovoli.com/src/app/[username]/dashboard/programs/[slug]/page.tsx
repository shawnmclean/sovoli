import { notFound } from "next/navigation";

import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Link } from "@sovoli/ui/components/link";

import { bus } from "~/services/core/bus";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import type { Program } from "~/modules/academics/types";

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;

  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );
  const orgInstance = result.orgInstance;
  if (!orgInstance?.academicModule) return notFound();

  const program = orgInstance.academicModule.programs.find(
    (p: Program) => p.slug === slug,
  );
  if (!program) return notFound();

  const baseDashboardPath = `/${username}/dashboard`;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{program.name}</h1>
        <p className="text-default-500">Program details and lead management.</p>
      </div>

      <Card>
        <CardBody className="space-y-3">
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <span className="font-medium">Slug:</span> {program.slug}
            </div>
            <div>
              <span className="font-medium">Program ID:</span> {program.id}
            </div>
            <div className="sm:col-span-2">
              <span className="font-medium">Cycles:</span>{" "}
              {program.cycles?.length ?? 0}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              as={Link}
              href={`${baseDashboardPath}/programs/${program.slug}/leads`}
              color="primary"
              radius="full"
            >
              View leads for this program
            </Button>
            <Button
              as={Link}
              href={`${baseDashboardPath}/leads/list`}
              variant="flat"
              color="default"
              radius="full"
            >
              View all leads
            </Button>
            <div className="flex-1" />
            <Button
              as={Link}
              href={`${baseDashboardPath}/programs`}
              variant="light"
              color="default"
              radius="full"
            >
              Back to programs
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

