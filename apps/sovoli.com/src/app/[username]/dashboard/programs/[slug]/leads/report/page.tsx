import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { notFound } from "next/navigation";
import type { Program } from "~/modules/academics/types";
import { parseLeadsModule } from "~/modules/data/organisations/utils/parseLeadsModule";
import healingEmeraldLeadsData from "~/modules/data/organisations/vocational-school/jamaica/healingemeraldwellness/leads.json";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { bus } from "~/services/core/bus";
import type { LeadInteraction } from "../utils/leadCategorization";
import { categorizeLead } from "../utils/leadCategorization";
import type { InteractionHistory } from "./InteractionHistoryModal";
import { InteractionHistoryModal } from "./InteractionHistoryModal";

interface ReportLead {
  name: string;
  phone: string;
  initialCycle: string;
  contacted: string;
  engagementLevel?: string;
  currentInterest: string;
  primaryBlocker: string;
  notes?: string;
  requestedCycleChange?: string;
  originalSelection?: string;
  initialSubmission?: string;
  interactionHistory?: InteractionHistory[];
  systemState: {
    emoji: string;
    label: string;
  };
}

/**
 * Helper function to format date for display
 */
function formatDate(dateString: string | undefined): string {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

/**
 * Helper function to format cycle label from cycleId
 */
function formatCycleLabel(cycleId: string): string {
  // Extract date from cycleId like "hew-massage-20260225"
  const regex = /(\d{4})(\d{2})(\d{2})/;
  const match = regex.exec(cycleId);
  const year = match?.[1];
  const month = match?.[2];
  if (year && month) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthName = monthNames[parseInt(month, 10) - 1];
    return `${monthName} ${year}`;
  }
  return cycleId;
}

/**
 * Helper function to transform interaction to InteractionHistory format
 */
function transformInteraction(
  interaction: LeadInteraction,
): InteractionHistory {
  return {
    timestamp: formatDate(interaction.loggedAt),
    contactOutcome: interaction.contactOutcome
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    interestLevel: interaction.interestLevel
      ? interaction.interestLevel
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : undefined,
    blocker: interaction.blocker
      ? interaction.blocker
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : undefined,
    nextAction: interaction.nextAction
      ? interaction.nextAction
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : undefined,
    notReachedReason: interaction.notReachedReason
      ? interaction.notReachedReason
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : undefined,
    notes: interaction.notes,
  };
}

/**
 * Helper function to get contacted status string
 */
function getContactedStatus(interactions: LeadInteraction[]): string {
  if (interactions.length === 0) return "No contact";
  const latest = interactions[0];
  if (!latest) return "No contact";
  if (latest.contactOutcome === "not_reached") {
    return "Attempted – not reached";
  }
  if (latest.contactOutcome === "brief_contact") {
    if (interactions.length === 1) return "Yes (brief contact)";
    return "Yes (brief only)";
  }
  // latest.contactOutcome must be "conversation" at this point
  if (interactions.length > 1) return "Yes (multiple times)";
  return "Yes (full conversation)";
}

/**
 * Helper function to get current interest from latest interaction
 */
function getCurrentInterest(interactions: LeadInteraction[]): string {
  if (interactions.length === 0) return "Unknown";
  const latest = interactions[0];
  if (!latest) return "Unknown";
  if (latest.interestLevel) {
    return latest.interestLevel
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return "Unknown";
}

/**
 * Helper function to get primary blocker from latest interaction
 */
function getPrimaryBlocker(interactions: LeadInteraction[]): string {
  if (interactions.length === 0) return "N/A";
  const latest = interactions[0];
  if (!latest) return "N/A";
  if (latest.blocker) {
    return latest.blocker
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  if (latest.contactOutcome === "not_reached") return "N/A";
  return "None";
}

/**
 * Helper function to extract requested cycle change from notes
 */
function getRequestedCycleChange(
  interactions: LeadInteraction[],
): string | undefined {
  for (const interaction of interactions) {
    if (interaction.notes) {
      const noteLower = interaction.notes.toLowerCase();
      if (noteLower.includes("february") || noteLower.includes("feb")) {
        return "February 2026";
      }
      if (noteLower.includes("april")) {
        return "April 2026";
      }
    }
  }
  return undefined;
}

/**
 * Helper function to aggregate notes from interactions
 */
function aggregateNotes(interactions: LeadInteraction[]): string | undefined {
  const notes = interactions
    .filter((i) => i.notes)
    .map((i) => i.notes)
    .filter((n): n is string => !!n);
  if (notes.length === 0) return undefined;
  return notes.join("\n");
}

function getStateColor(
  state: string,
): "success" | "warning" | "default" | "danger" {
  if (state === "🟢") return "success";
  if (state === "🟡") return "warning";
  if (state === "⚪") return "default";
  if (state === "🔴") return "danger";
  return "default";
}

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

export default async function LeadsReportPage({ params }: Props) {
  const { username, slug } = await params;

  // Hard code check for healingemeraldwellness and massage-therapy
  if (username !== "healingemeraldwellness" || slug !== "massage-therapy") {
    return notFound();
  }

  // Load org instance and program
  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );

  const orgInstance = result.orgInstance;
  if (!orgInstance?.academicModule) {
    return notFound();
  }

  const program = orgInstance.academicModule.programs.find(
    (p: Program) => p.slug === slug,
  );

  if (!program) {
    return notFound();
  }

  // Load and parse leads data
  const leadsModule = parseLeadsModule(healingEmeraldLeadsData);
  const allLeads = leadsModule.leads;

  // Filter leads for this program
  const programLeads = allLeads.filter((lead) => {
    if (lead.programId === program.id) return true;
    if (program.cycles && lead.cycleId) {
      return program.cycles.some((cycle) => cycle.id === lead.cycleId);
    }
    return false;
  });

  // Transform leads to ReportLead format
  const reportLeads: ReportLead[] = programLeads.map((lead) => {
    const rawInteractions = (lead.interactions ?? []) as LeadInteraction[];
    const interactions: LeadInteraction[] = [...rawInteractions].sort(
      (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime(),
    );

    const systemState = categorizeLead(lead, interactions);

    // Get cycle label
    const cycle = program.cycles?.find((c) => c.id === lead.cycleId);
    const cycleLabel =
      cycle?.academicCycle.customLabel ??
      cycle?.academicCycle.globalCycle?.label ??
      formatCycleLabel(lead.cycleId);

    const contacted = getContactedStatus(interactions);
    const currentInterest = getCurrentInterest(interactions);
    const primaryBlocker = getPrimaryBlocker(interactions);
    const requestedCycleChange = getRequestedCycleChange(interactions);
    const notes = aggregateNotes(interactions);

    let engagementLevel: string | undefined;
    if (interactions.length > 1) {
      engagementLevel = `High (${interactions.length} interactions)`;
    } else if (interactions.length === 1) {
      engagementLevel = "1 interaction";
    }

    return {
      name: lead.name,
      phone: lead.phone,
      initialCycle: cycleLabel,
      contacted,
      engagementLevel,
      currentInterest,
      primaryBlocker,
      notes,
      requestedCycleChange,
      originalSelection: lead.selection
        ? lead.selection.charAt(0).toUpperCase() +
          lead.selection.slice(1).replace(/_/g, " ")
        : undefined,
      initialSubmission: formatDate(lead.submittedAt),
      interactionHistory:
        interactions.length > 0
          ? interactions.map(transformInteraction)
          : undefined,
      systemState: {
        emoji: systemState.emoji,
        label: systemState.label,
      },
    };
  });

  // Separate leads with and without activity
  const leadsWithActivity = reportLeads.filter(
    (lead) => lead.interactionHistory && lead.interactionHistory.length > 0,
  );
  const leadsWithoutActivity = reportLeads.filter(
    (lead) => !lead.interactionHistory || lead.interactionHistory.length === 0,
  );

  // Calculate summary stats from system states
  const summary = {
    strong: 0,
    uncertain: 0,
    lowIntent: 0,
    noVisibility: 0,
  };

  for (const lead of reportLeads) {
    if (lead.systemState.emoji === "🟢") {
      summary.strong++;
    } else if (lead.systemState.emoji === "🟡") {
      summary.uncertain++;
    } else if (lead.systemState.emoji === "⚪") {
      summary.lowIntent++;
    } else if (lead.systemState.emoji === "🔴") {
      summary.noVisibility++;
    }
  }

  // Get current date for "As of" field
  const asOf = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Healing Emerald Wellness – Lead Snapshot Report
        </h1>
        <div className="space-y-1 text-sm text-default-500">
          <p>
            <span className="font-medium">Program:</span> {program.name}
          </p>
          <p>
            <span className="font-medium">As of:</span> {asOf}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-success">
              {summary.strong}
            </div>
            <div className="text-xs text-default-500">
              🟢 Strong / Wants to Proceed
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-warning">
              {summary.uncertain}
            </div>
            <div className="text-xs text-default-500">
              🟡 Uncertain / Needs clarity
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-default">
              {summary.lowIntent}
            </div>
            <div className="text-xs text-default-500">⚪ Low intent</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-danger">
              {summary.noVisibility}
            </div>
            <div className="text-xs text-default-500">🔴 No visibility</div>
          </CardBody>
        </Card>
      </div>

      {/* Leads With Activity */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Leads With Activity</h2>
        {leadsWithActivity.map((lead, index) => (
          <Card key={lead.name}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {index + 1}. {lead.name}
                  </h3>
                </div>
                <Chip
                  color={getStateColor(lead.systemState.emoji)}
                  variant="flat"
                  size="sm"
                >
                  {lead.systemState.emoji} {lead.systemState.label}
                </Chip>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <span className="font-medium">Phone:</span> {lead.phone}
                </div>
                <div>
                  <span className="font-medium">Initial Cycle:</span>{" "}
                  {lead.initialCycle}
                </div>
                {lead.requestedCycleChange && (
                  <div className="sm:col-span-2">
                    <span className="font-medium">Requested Cycle Change:</span>{" "}
                    {lead.requestedCycleChange}
                  </div>
                )}
                {lead.originalSelection && (
                  <div className="sm:col-span-2">
                    <span className="font-medium">Original Selection:</span>{" "}
                    {lead.originalSelection}
                  </div>
                )}
                {lead.initialSubmission && (
                  <div className="sm:col-span-2">
                    <span className="font-medium">Initial Submission:</span>{" "}
                    {lead.initialSubmission}
                  </div>
                )}
                <div>
                  <span className="font-medium">Contacted:</span>{" "}
                  {lead.contacted}
                </div>
                {lead.engagementLevel && (
                  <div>
                    <span className="font-medium">Engagement Level:</span>{" "}
                    {lead.engagementLevel}
                  </div>
                )}
                <div>
                  <span className="font-medium">Current Interest:</span>{" "}
                  {lead.currentInterest}
                </div>
                <div>
                  <span className="font-medium">Primary Blocker:</span>{" "}
                  {lead.primaryBlocker}
                </div>
              </div>
              {lead.notes && (
                <div className="rounded-md bg-default-100 p-3">
                  <div className="text-sm">
                    <span className="font-medium">Notes:</span>
                    <pre className="mt-1 whitespace-pre-wrap font-sans text-sm">
                      {lead.notes}
                    </pre>
                  </div>
                </div>
              )}
              {lead.interactionHistory &&
                lead.interactionHistory.length > 0 && (
                  <div>
                    <InteractionHistoryModal
                      leadName={lead.name}
                      interactionHistory={lead.interactionHistory}
                    />
                  </div>
                )}
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Leads Without Activity */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Leads With No Logged Activity (Status Unknown)
        </h2>
        {leadsWithoutActivity.map((lead, index) => (
          <Card key={lead.name}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {leadsWithActivity.length + index + 1}. {lead.name}
                  </h3>
                </div>
                <Chip
                  color={getStateColor(lead.systemState.emoji)}
                  variant="flat"
                  size="sm"
                >
                  {lead.systemState.emoji} {lead.systemState.label}
                </Chip>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <span className="font-medium">Phone:</span> {lead.phone}
                </div>
                <div>
                  <span className="font-medium">Cycle:</span>{" "}
                  {lead.initialCycle}
                </div>
                <div>
                  <span className="font-medium">Contacted:</span>{" "}
                  {lead.contacted}
                </div>
                <div>
                  <span className="font-medium">System State:</span>{" "}
                  {lead.systemState.emoji} {lead.systemState.label}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* High-Level Counts */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">High-Level Counts (Derived)</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-success">🟢</span>
              <span>
                <span className="font-medium">Strong / Wants to Proceed:</span>{" "}
                {summary.strong}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-warning">🟡</span>
              <span>
                <span className="font-medium">Uncertain / Needs clarity:</span>{" "}
                {summary.uncertain}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-default">⚪</span>
              <span>
                <span className="font-medium">Low intent:</span>{" "}
                {summary.lowIntent}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-danger">🔴</span>
              <span>
                <span className="font-medium">No visibility:</span>{" "}
                {summary.noVisibility}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
