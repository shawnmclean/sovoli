import { notFound } from "next/navigation";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { InteractionHistoryModal } from "./InteractionHistoryModal";
import type { InteractionHistory } from "./InteractionHistoryModal";

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

interface ReportData {
  program: string;
  asOf: string;
  leadsWithActivity: ReportLead[];
  leadsWithoutActivity: ReportLead[];
  summary: {
    strong: number;
    uncertain: number;
    lowIntent: number;
    noVisibility: number;
  };
}

const REPORT_DATA: ReportData = {
  program: "Massage Therapy Training",
  asOf: "Jan 15, 2026",
  leadsWithActivity: [
    {
      name: "Fabion Black",
      phone: "+18768087169",
      initialCycle: "February 2026",
      initialSubmission: "January 9, 2026 at 16:16:47 UTC",
      contacted: "Yes (multiple times)",
      engagementLevel: "High (9 interactions)",
      currentInterest: "Unsure",
      primaryBlocker: "Price uncertainty",
      notes: "At one point wanted to proceed\nAlso referenced wrong program",
      originalSelection: "Enroll",
      interactionHistory: [
        {
          timestamp: "January 9, 2026 at 17:54:08 UTC",
          contactOutcome: "Not reached",
          notReachedReason: "Try again later",
        },
        {
          timestamp: "January 9, 2026 at 18:00:42 UTC",
          contactOutcome: "Brief contact",
          interestLevel: "Curious",
          blocker: "Not serious",
          nextAction: "Follow up later",
          notes: "test",
        },
        {
          timestamp: "January 9, 2026 at 18:07:30 UTC",
          contactOutcome: "Brief contact",
          interestLevel: "Curious",
          blocker: "Needs visit",
          nextAction: "Waiting on them",
        },
        {
          timestamp: "January 9, 2026 at 18:19:57 UTC",
          contactOutcome: "Brief contact",
          interestLevel: "Curious",
          blocker: "Not serious",
          nextAction: "Waiting on them",
          notes: "wrong program, not offered",
        },
        {
          timestamp: "January 9, 2026 at 18:21:46 UTC",
          contactOutcome: "Conversation",
          interestLevel: "Wants to proceed",
          nextAction: "Follow up later",
        },
        {
          timestamp: "January 9, 2026 at 18:29:35 UTC",
          contactOutcome: "Brief contact",
          interestLevel: "Unsure",
          blocker: "Needs time",
          nextAction: "Waiting on them",
          notes: "1515",
        },
        {
          timestamp: "January 9, 2026 at 22:04:15 UTC",
          contactOutcome: "Conversation",
          interestLevel: "Unsure",
          blocker: "Price uncertainty",
          nextAction: "No follow-up",
        },
        {
          timestamp: "January 9, 2026 at 22:33:02 UTC",
          contactOutcome: "Conversation",
          interestLevel: "Unsure",
          blocker: "Price uncertainty",
          nextAction: "No follow-up",
        },
      ],
      systemState: {
        emoji: "🟡",
        label: "Price-sensitive / Unclear fit",
      },
    },
    {
      name: "Vanessa Bloomfield",
      phone: "+18769901701",
      initialCycle: "January 2026",
      initialSubmission: "January 9, 2026 at 01:58:22 UTC",
      contacted: "Yes (brief contact)",
      currentInterest: "Not interested",
      primaryBlocker: "Not serious",
      originalSelection: "Enroll",
      interactionHistory: [
        {
          timestamp: "January 14, 2026 at 19:07:02 UTC",
          contactOutcome: "Brief contact",
          interestLevel: "Not interested",
          blocker: "Not serious",
          nextAction: "No follow-up",
        },
      ],
      systemState: {
        emoji: "⚪",
        label: "Low intent",
      },
    },
    {
      name: "Tyrone Keldo",
      phone: "+18767765264",
      initialCycle: "January 2026",
      initialSubmission: "January 6, 2026 at 23:00:39 UTC",
      contacted: "Yes (brief only)",
      currentInterest: "Curious but not serious",
      primaryBlocker: "Needs visit",
      originalSelection: "Enroll",
      interactionHistory: [
        {
          timestamp: "January 9, 2026 at 18:17:11 UTC",
          contactOutcome: "Brief contact",
          interestLevel: "Unsure",
          blocker: "Needs visit",
          nextAction: "No follow-up",
          notes: "test",
        },
        {
          timestamp: "January 9, 2026 at 22:34:33 UTC",
          contactOutcome: "Brief contact",
          interestLevel: "Curious",
          blocker: "Not serious",
          nextAction: "No follow-up",
        },
      ],
      systemState: {
        emoji: "⚪",
        label: "Low intent",
      },
    },
    {
      name: "Therese Hendricks",
      phone: "+18768219862",
      initialCycle: "January 2026",
      initialSubmission: "January 6, 2026 at 16:43:49 UTC",
      requestedCycleChange: "February 2026",
      contacted: "Yes (full conversation)",
      currentInterest: "Wants to proceed",
      primaryBlocker: "None",
      notes: "Interested in a later date. February",
      originalSelection: "Enroll",
      interactionHistory: [
        {
          timestamp: "January 9, 2026 at 22:36:06 UTC",
          contactOutcome: "Conversation",
          interestLevel: "Wants to proceed",
          nextAction: "Follow up later",
          notes: "Interested in a later date. February",
        },
      ],
      systemState: {
        emoji: "🟢",
        label: "Strong – Deferred to Feb",
      },
    },
    {
      name: "John Lewis",
      phone: "+18765579703",
      initialCycle: "January 2026",
      initialSubmission: "January 6, 2026 at 02:18:08 UTC",
      originalSelection: "Visit",
      contacted: "Attempted – not reached",
      currentInterest: "Unknown",
      primaryBlocker: "N/A",
      interactionHistory: [
        {
          timestamp: "January 14, 2026 at 19:26:09 UTC",
          contactOutcome: "Not reached",
          notReachedReason: "Try again later",
        },
      ],
      systemState: {
        emoji: "🟡",
        label: "Pending contact",
      },
    },
    {
      name: "Zoe Richards",
      phone: "+18765091348",
      initialCycle: "January 2026",
      initialSubmission: "January 5, 2026 at 17:18:49 UTC",
      originalSelection: "Visit",
      requestedCycleChange: "February 2026",
      contacted: "Yes (conversation)",
      currentInterest: "Wants to proceed",
      primaryBlocker: "None",
      notes: "Interested in February 25 intake",
      interactionHistory: [
        {
          timestamp: "January 14, 2026 at 19:07:54 UTC",
          contactOutcome: "Conversation",
          interestLevel: "Wants to proceed",
          nextAction: "Waiting on them",
          notes: "Interested in February 25 intake",
        },
      ],
      systemState: {
        emoji: "🟢",
        label: "Strong – February intake",
      },
    },
    {
      name: "Amanda Dunn",
      phone: "+18763135484",
      initialCycle: "April 2026",
      initialSubmission: "January 5, 2026 at 07:36:30 UTC",
      contacted: "Yes (conversation)",
      currentInterest: "Wants to proceed",
      primaryBlocker: "None",
      notes: "Interested in April batch",
      originalSelection: "Enroll",
      interactionHistory: [
        {
          timestamp: "January 9, 2026 at 22:39:32 UTC",
          contactOutcome: "Conversation",
          interestLevel: "Wants to proceed",
          nextAction: "Follow up later",
          notes: "Interested in April batch",
        },
      ],
      systemState: {
        emoji: "🟢",
        label: "Strong – April intake",
      },
    },
    {
      name: "Handasyde Ellington",
      phone: "+18765339478",
      initialCycle: "April 2026",
      initialSubmission: "January 2, 2026 at 15:28:19 UTC",
      contacted: "Yes (brief contact)",
      currentInterest: "Wants to proceed",
      primaryBlocker: "None",
      notes: "Interested in April intake",
      originalSelection: "Enroll",
      interactionHistory: [
        {
          timestamp: "January 14, 2026 at 19:33:20 UTC",
          contactOutcome: "Brief contact",
          interestLevel: "Wants to proceed",
          nextAction: "Waiting on them",
          notes: "Interested in April intake",
        },
        {
          timestamp: "January 14, 2026 at 19:33:57 UTC",
          contactOutcome: "Brief contact",
          interestLevel: "Wants to proceed",
          nextAction: "Waiting on them",
          notes: "Interested in April intake",
        },
      ],
      systemState: {
        emoji: "🟢",
        label: "Strong – April intake",
      },
    },
    {
      name: "Stephnie Beckford",
      phone: "+18767900587",
      initialCycle: "April 2026",
      initialSubmission: "January 2, 2026 at 12:43:45 UTC",
      contacted: "Yes (brief contact)",
      currentInterest: "Unsure",
      primaryBlocker: "Needs time",
      notes: "She will get back to see if she have the time",
      originalSelection: "Enroll",
      interactionHistory: [
        {
          timestamp: "January 14, 2026 at 19:38:15 UTC",
          contactOutcome: "Brief contact",
          interestLevel: "Unsure",
          blocker: "Needs time",
          nextAction: "Waiting on them",
          notes: "She will get back to see if she have the time",
        },
      ],
      systemState: {
        emoji: "🟡",
        label: "Needs time to decide",
      },
    },
    {
      name: "Renard Raymond",
      phone: "+18764370381",
      initialCycle: "January 2026",
      initialSubmission: "January 2, 2026 at 01:23:23 UTC",
      originalSelection: "Visit",
      contacted: "Attempted – not reached",
      currentInterest: "Unknown",
      primaryBlocker: "N/A",
      interactionHistory: [
        {
          timestamp: "January 9, 2026 at 22:44:37 UTC",
          contactOutcome: "Not reached",
          notReachedReason: "Try again later",
        },
      ],
      systemState: {
        emoji: "🟡",
        label: "Pending contact",
      },
    },
    {
      name: "Sekunya Bradbury",
      phone: "+18768486845",
      initialCycle: "January 2026",
      initialSubmission: "January 1, 2026 at 21:55:13 UTC",
      requestedCycleChange: "April 2026",
      contacted: "Yes (brief)",
      currentInterest: "Wants to proceed",
      primaryBlocker: "None",
      notes: "Interested in April",
      originalSelection: "Enroll",
      interactionHistory: [
        {
          timestamp: "January 9, 2026 at 22:45:25 UTC",
          contactOutcome: "Brief contact",
          interestLevel: "Wants to proceed",
          nextAction: "Follow up later",
          notes: "Interested in April",
        },
      ],
      systemState: {
        emoji: "🟢",
        label: "Strong – April intake",
      },
    },
    {
      name: "Odette Leslie-Murphy",
      phone: "+18765250459",
      initialCycle: "January 2026",
      initialSubmission: "January 1, 2026 at 21:31:50 UTC",
      contacted: "Attempted – not reached",
      currentInterest: "Unknown",
      primaryBlocker: "N/A",
      originalSelection: "Enroll",
      interactionHistory: [
        {
          timestamp: "January 14, 2026 at 19:41:50 UTC",
          contactOutcome: "Not reached",
          notReachedReason: "Try again later",
        },
      ],
      systemState: {
        emoji: "🟡",
        label: "Pending contact",
      },
    },
  ],
  leadsWithoutActivity: [],
  summary: {
    strong: 5,
    uncertain: 2,
    lowIntent: 2,
    noVisibility: 0,
  },
};

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

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Healing Emerald Wellness – Lead Snapshot Report
        </h1>
        <div className="space-y-1 text-sm text-default-500">
          <p>
            <span className="font-medium">Program:</span> {REPORT_DATA.program}
          </p>
          <p>
            <span className="font-medium">As of:</span> {REPORT_DATA.asOf}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-success">
              {REPORT_DATA.summary.strong}
            </div>
            <div className="text-xs text-default-500">
              🟢 Strong / Wants to Proceed
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-warning">
              {REPORT_DATA.summary.uncertain}
            </div>
            <div className="text-xs text-default-500">
              🟡 Uncertain / Needs clarity
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-default">
              {REPORT_DATA.summary.lowIntent}
            </div>
            <div className="text-xs text-default-500">⚪ Low intent</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-danger">
              {REPORT_DATA.summary.noVisibility}
            </div>
            <div className="text-xs text-default-500">🔴 No visibility</div>
          </CardBody>
        </Card>
      </div>

      {/* Leads With Activity */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Leads With Activity</h2>
        {REPORT_DATA.leadsWithActivity.map((lead, index) => (
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
        {REPORT_DATA.leadsWithoutActivity.map((lead, index) => (
          <Card key={lead.name}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {REPORT_DATA.leadsWithActivity.length + index + 1}.{" "}
                    {lead.name}
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
                {REPORT_DATA.summary.strong}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-warning">🟡</span>
              <span>
                <span className="font-medium">Uncertain / Needs clarity:</span>{" "}
                {REPORT_DATA.summary.uncertain}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-default">⚪</span>
              <span>
                <span className="font-medium">Low intent:</span>{" "}
                {REPORT_DATA.summary.lowIntent}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-danger">🔴</span>
              <span>
                <span className="font-medium">No visibility:</span>{" "}
                {REPORT_DATA.summary.noVisibility}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
