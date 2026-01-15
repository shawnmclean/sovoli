import { useState } from "react";
import { Card, CardHeader, CardBody } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Button } from "@sovoli/ui/components/button";
import { EditIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";
import type { Lead } from "../../../../components/LeadsTable";
import type { LeadInteraction, SystemState } from "../utils/leadCategorization";

// --- Helpers copied/adapted from LeadsTable.tsx ---

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
 * Component for name with tap-to-reveal
 */
function NameDisplay({ name }: { name: string }) {
    const [isRevealed, setIsRevealed] = useState(false);

    if (!isRevealed) {
        return (
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsRevealed(true);
                }}
                className="font-semibold text-lg underline cursor-pointer hover:text-default-700 transition-colors text-left"
            >
                {abbreviateName(name)}
            </button>
        );
    }

    return <span className="font-semibold text-lg">{name}</span>;
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

// --- End Helpers ---


// Helper for chip colors
function getStateColor(
    state: SystemState
): "success" | "warning" | "default" | "danger" {
    if (state.emoji === "🟢") return "success";
    if (state.emoji === "🟡") return "warning";
    if (state.emoji === "⚪") return "default";
    if (state.emoji === "🔴") return "danger";
    return "default";
}

interface ProgramLeadCardProps {
    lead: Lead;
    index: number;
    interactions: LeadInteraction[];
    systemState: SystemState;
    onUpdateClick: (leadId: string) => void;
    programName?: string;
}

export function ProgramLeadCard({
    lead,
    index,
    interactions,
    systemState,
    onUpdateClick,
    programName
}: ProgramLeadCardProps) {
    // Get latest info for display
    const latestInteraction = interactions[0]; // Assuming sorted outside

    // Format initial submission
    const submissionDate = new Date(lead.submittedAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
    });

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between w-full">
                    <div className="flex items-center gap-2">
                        <span className="text-default-500 font-mono text-sm">#{index + 1}</span>
                        <NameDisplay name={lead.name} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Chip
                            color={getStateColor(systemState)}
                            variant="flat"
                            size="sm"
                        >
                            {systemState.emoji} {systemState.label}
                        </Chip>
                        <Button
                            variant="light"
                            isIconOnly
                            size="sm"
                            onPress={() => onUpdateClick(lead.id)}
                        >
                            <EditIcon className="w-4 h-4 text-default-500" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="space-y-3 pt-0">
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                        <span className="font-medium text-default-600">Contact:</span>
                        <PhoneNumberButton
                            phone={lead.phone}
                            onContactClick={() => onUpdateClick(lead.id)}
                        />
                    </div>
                    <div>
                        <span className="font-medium text-default-600">Cycle:</span>{" "}
                        {lead.cycleLabel || "Unknown"}
                    </div>

                    {lead.selection && (
                        <div>
                            <span className="font-medium text-default-600">Original Selection:</span>{" "}
                            {lead.selection}
                        </div>
                    )}

                    <div className="sm:col-span-2 text-xs text-default-400">
                        Submitted: {submissionDate}
                    </div>

                    {latestInteraction && (
                        <>
                            <div className="sm:col-span-2 border-t border-default-100 my-1 pt-2">
                                <span className="font-medium text-default-600">Latest Activity:</span>
                            </div>
                            <div>
                                <span className="font-medium text-default-600">Contacted:</span>{" "}
                                {latestInteraction.contactOutcome.replace(/_/g, " ")}
                            </div>

                            {latestInteraction.interestLevel && (
                                <div>
                                    <span className="font-medium text-default-600">Interest:</span>{" "}
                                    {latestInteraction.interestLevel.replace(/_/g, " ")}
                                </div>
                            )}

                            {latestInteraction.notes && (
                                <div className="sm:col-span-2 bg-default-50 p-2 rounded mt-1">
                                    <span className="font-medium text-default-600">Note:</span> {latestInteraction.notes}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}
