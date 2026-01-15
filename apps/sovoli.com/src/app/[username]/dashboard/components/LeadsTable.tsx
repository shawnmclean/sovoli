"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { TimeAgo } from "@sovoli/ui/components/time-ago";
import { Button } from "@sovoli/ui/components/button";
import { Chip } from "@sovoli/ui/components/chip";
import { MessageCircleIcon, PhoneIcon, EditIcon } from "lucide-react";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Program, ProgramCycle } from "~/modules/academics/types";
import { LeadInteractionModal } from "./LeadInteractionModal";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  cycleId: string;
  submittedAt: string;
  selection?: "enroll" | "visit" | "more_information";
  programId?: string;
  programName?: string;
  cycleLabel?: string;
  interactions?: LeadInteraction[];
}

interface LeadInteraction {
  contactOutcome: "not_reached" | "brief_contact" | "conversation";
  notReachedReason?: "try_again_later" | "invalid_number";
  interestLevel?: "not_interested" | "curious" | "unsure" | "wants_to_proceed";
  blocker?:
  | "different_program"
  | "timing"
  | "needs_time"
  | "needs_approval"
  | "needs_visit"
  | "price_uncertainty"
  | "comparing"
  | "not_serious";
  nextAction?:
  | "follow_up_later"
  | "visit_scheduled"
  | "waiting_on_them"
  | "no_followup";
  notes?: string;
  loggedAt: string;
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
 * Helper function to derive status from interaction data
 */
function getInteractionStatus(interaction: LeadInteraction | undefined): {
  label: string;
  color: "default" | "warning" | "success" | "danger";
} | null {
  if (!interaction) return null;

  if (interaction.contactOutcome === "not_reached") {
    return { label: "Not Reached", color: "default" };
  }

  if (interaction.interestLevel === "not_interested") {
    return { label: "Not Interested", color: "default" };
  }

  if (
    interaction.nextAction === "visit_scheduled" ||
    interaction.interestLevel === "wants_to_proceed"
  ) {
    return { label: "Active", color: "success" };
  }

  if (
    interaction.nextAction === "follow_up_later" ||
    interaction.interestLevel === "curious" ||
    interaction.interestLevel === "unsure"
  ) {
    return { label: "Follow Up", color: "warning" };
  }

  return null;
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
function PhoneNumberButton({
  phone,
  onContactClick,
}: {
  phone: string;
  onContactClick?: () => void;
}) {
  const [isRevealed, setIsRevealed] = useState(false);

  // Sanitize phone for WhatsApp (remove all non-digits, assume country code is present)
  const cleanedPhone = phone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanedPhone}`;
  // Use tel: protocol for phone calls (keep the + and numbers)
  const telUrl = `tel:${phone.replace(/[^\d+]/g, "")}`;

  const handleWhatsAppClick = () => {
    // Open modal first
    onContactClick?.();
    // Then open WhatsApp in a new tab/window
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleCallClick = () => {
    // Open modal first
    onContactClick?.();
    // Then trigger the call
    window.location.href = telUrl;
  };

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
          variant="flat"
          size="sm"
          color="success"
          startContent={<MessageCircleIcon className="h-4 w-4" />}
          onPress={handleWhatsAppClick}
        >
          WhatsApp
        </Button>
        <Button
          variant="flat"
          size="sm"
          color="primary"
          startContent={<PhoneIcon className="h-4 w-4" />}
          onPress={handleCallClick}
        >
          Call
        </Button>
      </div>
    </div>
  );
}

export function LeadsTable({ leads, orgInstance }: LeadsTableProps) {
  // Store interaction data per lead ID
  const [leadInteractions, setLeadInteractions] = useState<
    Record<string, LeadInteraction>
  >({});
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onOpenChange: onModalOpenChange,
  } = useDisclosure();

  const handleUpdateClick = (leadId: string) => {
    setSelectedLeadId(leadId);
    onModalOpen();
  };

  const handleSaveInteraction = (interaction: LeadInteraction) => {
    if (!selectedLeadId) return;

    setLeadInteractions((prev) => ({
      ...prev,
      [selectedLeadId]: interaction,
    }));
    setSelectedLeadId(null);
  };

  const selectedLead = selectedLeadId
    ? leads.find((l) => l.id === selectedLeadId)
    : null;

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
    <>
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
              const interaction = leadInteractions[lead.id];
              const status = getInteractionStatus(interaction);

              return (
                <div
                  key={lead.id}
                  className="border border-default-200 rounded-lg p-4 hover:bg-default-50 transition-colors"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <NameDisplay name={lead.name} />
                        <div className="flex items-center gap-2 flex-wrap">
                          {status && (
                            <Chip color={status.color} size="sm" variant="flat">
                              {status.label}
                            </Chip>
                          )}
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
                      <div className="flex flex-col gap-1 text-xs text-default-500">
                        <div>
                          Submitted{" "}
                          <TimeAgo
                            datetime={new Date(lead.submittedAt)}
                            className="text-default-500"
                          />
                        </div>
                        {interaction && (
                          <div>
                            Last contact{" "}
                            <TimeAgo
                              datetime={new Date(interaction.loggedAt)}
                              className="text-default-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-start sm:items-end">
                      <PhoneNumberButton
                        phone={lead.phone}
                        onContactClick={() => handleUpdateClick(lead.id)}
                      />
                      <Button
                        variant="flat"
                        size="sm"
                        color="default"
                        startContent={<EditIcon className="h-4 w-4" />}
                        onPress={() => handleUpdateClick(lead.id)}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
      {selectedLead &&
        (() => {
          const cycleAndProgram = getCycleAndProgram(
            orgInstance,
            selectedLead.cycleId,
          );
          const programName =
            cycleAndProgram?.program.name ??
            selectedLead.programName ??
            "Unknown Program";
          const cycleLabel =
            selectedLead.cycleLabel ?? getCycleLabel(cycleAndProgram?.cycle);

          // Enhance lead with computed values if not already present
          const enhancedLead: Lead = {
            ...selectedLead,
            programId: selectedLead.programId ?? cycleAndProgram?.program.id,
            programName,
            cycleLabel,
          };

          return (
            <LeadInteractionModal
              lead={enhancedLead}
              orgInstance={orgInstance}
              isOpen={isModalOpen}
              onOpenChange={onModalOpenChange}
              onSave={handleSaveInteraction}
            />
          );
        })()}
    </>
  );
}
