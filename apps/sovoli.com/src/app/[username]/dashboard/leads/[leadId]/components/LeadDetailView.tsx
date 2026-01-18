"use client";

import { useMemo, useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Link } from "@sovoli/ui/components/link";
import { TimeAgo } from "@sovoli/ui/components/time-ago";

import type { OrgInstance } from "~/modules/organisations/types";
import type { Lead } from "~/modules/leads/types";
import { LeadInteractionModal } from "../../../components/LeadInteractionModal";
import { categorizeLead } from "../../../programs/[slug]/leads/utils/leadCategorization";
import type { LeadInteraction } from "../../../programs/[slug]/leads/utils/leadCategorization";

function getProgramAndCycleLabel(orgInstance: OrgInstance, lead: Lead): {
  programName: string;
  cycleLabel: string;
} {
  const programs = orgInstance.academicModule?.programs ?? [];
  for (const program of programs) {
    const cycle = (program.cycles ?? []).find((c) => c.id === lead.cycleId);
    if (cycle) {
      const label =
        cycle.academicCycle.customLabel ??
        cycle.academicCycle.globalCycle?.label ??
        lead.cycleId;
      return { programName: program.name ?? "Program", cycleLabel: label };
    }
    if (lead.programId && lead.programId === program.id) {
      return { programName: program.name ?? "Program", cycleLabel: lead.cycleId };
    }
  }
  return { programName: "Unknown Program", cycleLabel: lead.cycleId };
}

function getStatusColor(
  systemState: ReturnType<typeof categorizeLead>,
): "success" | "warning" | "default" | "danger" {
  if (systemState.emoji === "🟢") return "success";
  if (systemState.emoji === "🟡") return "warning";
  if (systemState.emoji === "⚪") return "default";
  return "danger";
}

export function LeadDetailView({
  orgInstance,
  initialLead,
}: {
  orgInstance: OrgInstance;
  initialLead: Lead;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interactions, setInteractions] = useState<LeadInteraction[]>(
    (initialLead.interactions ?? []) as LeadInteraction[],
  );

  const baseDashboardPath = `/${orgInstance.org.username}/dashboard`;

  const sortedInteractions = useMemo(
    () =>
      [...interactions].sort(
        (a, b) =>
          new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime(),
      ),
    [interactions],
  );

  const { programName, cycleLabel } = useMemo(
    () => getProgramAndCycleLabel(orgInstance, initialLead),
    [initialLead, orgInstance],
  );

  const systemState = useMemo(
    () => categorizeLead(initialLead, sortedInteractions),
    [initialLead, sortedInteractions],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button
          as={Link}
          href={`${baseDashboardPath}/leads/list`}
          variant="flat"
          color="default"
          radius="full"
        >
          Back to all leads
        </Button>
        <div className="flex-1" />
        <Button
          color="primary"
          radius="full"
          onPress={() => setIsModalOpen(true)}
        >
          Update lead
        </Button>
      </div>

      <Card>
        <CardHeader className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold truncate">{initialLead.name}</h1>
            <div className="text-sm text-default-500">{initialLead.phone}</div>
          </div>
          <Chip
            color={getStatusColor(systemState)}
            variant="flat"
            className="shrink-0"
          >
            {systemState.emoji} {systemState.label}
          </Chip>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <span className="font-medium">Program:</span> {programName}
            </div>
            <div>
              <span className="font-medium">Cycle:</span> {cycleLabel}
            </div>
            <div className="sm:col-span-2">
              <span className="font-medium">Submitted:</span>{" "}
              <TimeAgo datetime={new Date(initialLead.submittedAt)} />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold">Interaction history</h2>
          <p className="text-sm text-default-500">
            {sortedInteractions.length}{" "}
            {sortedInteractions.length === 1 ? "update" : "updates"}
          </p>
        </CardHeader>
        <CardBody>
          {sortedInteractions.length === 0 ? (
            <p className="text-sm text-default-500">
              No interactions logged yet.
            </p>
          ) : (
            <div className="space-y-3">
              {sortedInteractions.map((i) => (
                <div
                  key={i.loggedAt}
                  className="rounded-lg border border-default-200 p-3"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm font-medium text-default-900">
                      {i.contactOutcome.replace(/_/g, " ")}
                    </div>
                    <div className="text-xs text-default-500">
                      <TimeAgo datetime={new Date(i.loggedAt)} />
                    </div>
                  </div>
                  <div className="mt-2 grid gap-1 text-xs text-default-600 sm:grid-cols-2">
                    {i.notReachedReason && (
                      <div>
                        <span className="font-medium">Reason:</span>{" "}
                        {i.notReachedReason.replace(/_/g, " ")}
                      </div>
                    )}
                    {i.interestLevel && (
                      <div>
                        <span className="font-medium">Interest:</span>{" "}
                        {i.interestLevel.replace(/_/g, " ")}
                      </div>
                    )}
                    {i.blocker && (
                      <div>
                        <span className="font-medium">Blocker:</span>{" "}
                        {i.blocker.replace(/_/g, " ")}
                      </div>
                    )}
                    {i.nextAction && (
                      <div>
                        <span className="font-medium">Next:</span>{" "}
                        {i.nextAction.replace(/_/g, " ")}
                      </div>
                    )}
                    {i.notes && (
                      <div className="sm:col-span-2">
                        <span className="font-medium">Notes:</span> {i.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <LeadInteractionModal
        lead={{
          ...initialLead,
          programName,
          cycleLabel,
        }}
        orgInstance={orgInstance}
        isOpen={isModalOpen}
        onOpenChange={(open) => setIsModalOpen(open)}
        onSave={(interaction) => {
          setInteractions((prev) => [interaction as LeadInteraction, ...prev]);
        }}
      />
    </div>
  );
}

