"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { TimeAgo } from "@sovoli/ui/components/time-ago";
import { Button } from "@sovoli/ui/components/button";
import { Chip } from "@sovoli/ui/components/chip";
import { MessageCircleIcon, PhoneIcon } from "lucide-react";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Program, ProgramCycle } from "~/modules/academics/types";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  cycleId: string;
  submittedAt: string;
  selection?: "enroll" | "visit" | "more_information";
}

interface LeadsTableProps {
  leads: Lead[];
  orgInstance: OrgInstance;
}

/**
 * Helper function to find a program cycle by ID and return both the cycle and its parent program
 */
function getCycleAndProgram(
  orgInstance: OrgInstance,
  cycleId: string,
): { cycle: ProgramCycle; program: Program } | undefined {
  if (!orgInstance.academicModule?.programs) {
    return undefined;
  }

  // Search through all programs to find which one contains this cycle
  for (const program of orgInstance.academicModule.programs) {
    if (!program.cycles) {
      continue;
    }
    const cycle = program.cycles.find((c) => c.id === cycleId);
    if (cycle) {
      return { cycle, program };
    }
  }

  return undefined;
}

/**
 * Helper function to get cycle display label
 */
function getCycleLabel(cycle: ProgramCycle | undefined): string {
  if (!cycle) {
    return "Unknown Cycle";
  }
  // Prefer customLabel, then academic cycle label, then fallback to ID
  return (
    cycle.academicCycle.customLabel ??
    cycle.academicCycle.globalCycle?.label ??
    cycle.id
  );
}

/**
 * Helper function to format selection chip text
 */
function formatSelection(selection: Lead["selection"]): string {
  switch (selection) {
    case "enroll":
      return "Enroll";
    case "visit":
      return "Schedule Visit";
    case "more_information":
      return "More Info";
    default:
      return "Unknown";
  }
}

/**
 * Helper function to get selection chip color
 */
function getSelectionColor(
  selection: Lead["selection"],
): "success" | "primary" | "default" {
  switch (selection) {
    case "enroll":
      return "success";
    case "visit":
      return "primary";
    case "more_information":
      return "default";
    default:
      return "default";
  }
}

/**
 * Helper function to format phone number for display
 */
function formatPhone(phone: string): string {
  // Remove any non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, "");
  // Format Jamaican numbers (+1876) or keep as is
  if (cleaned.startsWith("+1876") && cleaned.length === 11) {
    return `+1 (876) ${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
  }
  // Format other international numbers
  if (cleaned.startsWith("+1") && cleaned.length === 12) {
    return `+1 (${cleaned.slice(2, 5)}) ${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
  }
  return cleaned;
}

/**
 * Helper function to abbreviate name (first name + first 2 chars of last name)
 */
function abbreviateName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return fullName;
  if (parts.length === 1) return parts[0] ?? "";

  const firstName = parts[0] ?? "";
  const lastName = parts[parts.length - 1] ?? "";

  if (lastName.length >= 2) {
    return `${firstName} ${lastName.slice(0, 2)}...`;
  }
  return `${firstName} ${lastName}...`;
}

/**
 * Component for name with tap-to-reveal
 */
function NameDisplay({ name }: { name: string }) {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!isRevealed) {
    return (
      <button
        type="button"
        onClick={() => setIsRevealed(true)}
        className="font-semibold text-sm sm:text-base underline cursor-pointer hover:text-default-700 transition-colors text-left"
      >
        {abbreviateName(name)}
      </button>
    );
  }

  return <span className="font-semibold text-sm sm:text-base">{name}</span>;
}

/**
 * Component for phone number with tap-to-reveal and action buttons
 */
function PhoneNumberButton({ phone }: { phone: string }) {
  const [isRevealed, setIsRevealed] = useState(false);

  // Sanitize phone for WhatsApp (remove all non-digits, assume country code is present)
  const cleanedPhone = phone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanedPhone}`;
  // Use tel: protocol for phone calls (keep the + and numbers)
  const telUrl = `tel:${phone.replace(/[^\d+]/g, "")}`;

  if (!isRevealed) {
    return (
      <Button
        variant="flat"
        size="sm"
        color="default"
        onClick={() => setIsRevealed(true)}
        className="font-mono"
      >
        Tap to view number
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2 items-start sm:items-end">
      <span className="font-mono text-sm font-semibold">
        {formatPhone(phone)}
      </span>
      <div className="flex gap-2">
        <Button
          as={Link}
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="flat"
          size="sm"
          color="success"
          startContent={<MessageCircleIcon className="h-4 w-4" />}
        >
          WhatsApp
        </Button>
        <Button
          as={Link}
          href={telUrl}
          variant="flat"
          size="sm"
          color="primary"
          startContent={<PhoneIcon className="h-4 w-4" />}
        >
          Call
        </Button>
      </div>
    </div>
  );
}

export function LeadsTable({ leads, orgInstance }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Program Leads</h2>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-default-500">No leads yet.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Program Leads</h2>
        <p className="text-sm text-default-500">
          {leads.length} {leads.length === 1 ? "lead" : "leads"}
        </p>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {leads.map((lead) => {
            const cycleAndProgram = getCycleAndProgram(
              orgInstance,
              lead.cycleId,
            );
            const programName =
              cycleAndProgram?.program.name ?? "Unknown Program";
            const cycleLabel = getCycleLabel(cycleAndProgram?.cycle);

            return (
              <div
                key={lead.id}
                className="border border-default-200 rounded-lg p-4 hover:bg-default-50 transition-colors"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <NameDisplay name={lead.name} />
                      {lead.selection && (
                        <Chip
                          color={getSelectionColor(lead.selection)}
                          size="sm"
                          variant="flat"
                        >
                          {formatSelection(lead.selection)}
                        </Chip>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 text-sm text-default-600">
                      <div>
                        <span className="font-medium">Program: </span>
                        <span>{programName}</span>
                      </div>
                      <div>
                        <span className="font-medium">Cycle: </span>
                        <span>{cycleLabel}</span>
                      </div>
                    </div>
                    <div className="text-xs text-default-500">
                      Submitted{" "}
                      <TimeAgo
                        datetime={new Date(lead.submittedAt)}
                        className="text-default-500"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 pt-1">
                    <PhoneNumberButton phone={lead.phone} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
