import { useState } from "react";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Button } from "@sovoli/ui/components/button";
import { EditIcon, MessageCircleIcon, PhoneIcon, ChevronRightIcon } from "lucide-react";
import type { Lead } from "../../../../components/LeadsTable";
import type { LeadInteraction, SystemState } from "../utils/leadCategorization";
import { LeadHistoryModal } from "./LeadHistoryModal";

// --- Helpers ---

function abbreviateName(fullName: string): string {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return fullName;
    return parts[0] ?? fullName;
}

function formatPhone(phone: string): string {
    const cleaned = phone.replace(/[^\d+]/g, "");
    if (cleaned.startsWith("+1876") && cleaned.length === 11) {
        return `(876) ${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
    }
    return cleaned;
}

// --- Components ---

function ActionButtons({
    phone,
    isRevealed,
    onReveal,
    onLogInteraction
}: {
    phone: string;
    isRevealed: boolean;
    onReveal: () => void;
    onLogInteraction: () => void;
}) {
    const cleanedPhone = phone.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${cleanedPhone}`;
    const telUrl = `tel:${phone.replace(/[^\d+]/g, "")}`;

    const handleWhatsAppClick = () => {
        onLogInteraction();
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

    const handleCallClick = () => {
        onLogInteraction();
        window.location.href = telUrl;
    };

    if (!isRevealed) {
        return (
            <Button
                className="w-full font-medium shadow-sm transition-transform active:scale-[0.98]"
                size="lg"
                color="primary"
                variant="solid"
                onPress={onReveal}
            >
                Reveal Contact Info
            </Button>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Button
                className="w-full font-medium shadow-sm"
                size="lg"
                color="success"
                variant="solid"
                startContent={<MessageCircleIcon className="w-5 h-5" />}
                onPress={handleWhatsAppClick}
            >
                WhatsApp
            </Button>
            <Button
                className="w-full font-medium shadow-sm"
                size="lg"
                color="primary"
                variant="solid"
                startContent={<PhoneIcon className="w-5 h-5" />}
                onPress={handleCallClick}
            >
                Call
            </Button>
        </div>
    );
}

function StatusIndicator({ state }: { state: SystemState }) {
    const colorMap = {
        "🟢": "bg-success-500",
        "🟡": "bg-warning-500",
        "⚪": "bg-default-300",
        "🔴": "bg-danger-500",
    };

    const bgColor = colorMap[state.emoji] || "bg-default-300";

    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${bgColor} shadow-sm`} />
            <span className="text-xs font-medium text-default-600 uppercase tracking-tight">
                {state.label}
            </span>
        </div>
    );
}

// --- Main Component ---

interface ProgramLeadCardProps {
    lead: Lead;
    interactions: LeadInteraction[];
    systemState: SystemState;
    onUpdateClick: (leadId: string) => void;
}

export function ProgramLeadCard({
    lead,
    interactions,
    systemState,
    onUpdateClick,
}: ProgramLeadCardProps) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Get latest interaction
    const latestInteraction = interactions[0];

    // Format date nicely
    const submissionDate = new Date(lead.submittedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
    });

    return (
        <Card className="w-full border-b border-default-100 shadow-none rounded-none sm:rounded-medium sm:border bg-background sm:shadow-sm">
            <CardBody className="p-4 sm:p-5 space-y-5">
                {/* Header: Name & Status */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div
                            className="flex items-center gap-2 cursor-pointer active:opacity-70 transition-opacity"
                            onClick={() => !isRevealed && setIsRevealed(true)}
                        >
                            <h3 className="text-xl font-bold text-foreground">
                                {isRevealed ? lead.name : abbreviateName(lead.name)}
                            </h3>
                            {!isRevealed && (
                                <span className="text-default-300 text-lg select-none">•••••</span>
                            )}
                        </div>
                        <StatusIndicator state={systemState} />
                    </div>

                    <Button
                        isIconOnly
                        variant="light"
                        className="text-default-400 -mr-2 -mt-2"
                        onPress={() => onUpdateClick(lead.id)}
                    >
                        <EditIcon className="w-5 h-5" />
                    </Button>
                </div>

                {/* Main Actions */}
                <div className="pt-1">
                    <ActionButtons
                        phone={lead.phone}
                        isRevealed={isRevealed}
                        onReveal={() => setIsRevealed(true)}
                        onLogInteraction={() => onUpdateClick(lead.id)}
                    />
                </div>

                {/* Context Info (Always Visible) */}
                <div className="grid grid-cols-2 gap-y-2 text-sm text-default-500">
                    <div>
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-default-400">
                            Cycle
                        </span>
                        <span className="text-foreground">{lead.cycleLabel ?? "Unknown"}</span>
                    </div>
                    <div>
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-default-400">
                            Submitted
                        </span>
                        <span>{submissionDate}</span>
                    </div>
                    {isRevealed && (
                        <div className="col-span-2">
                            <span className="block text-[10px] font-semibold uppercase tracking-wider text-default-400">
                                Phone
                            </span>
                            <span className="font-mono">{formatPhone(lead.phone)}</span>
                        </div>
                    )}
                </div>

                {/* Latest Activity Preview */}
                {latestInteraction && (
                    <div className="relative bg-default-50 rounded-lg p-3 text-sm">
                        <div className="font-medium text-foreground mb-1">
                            {latestInteraction.contactOutcome === "not_reached" ? "Did not reach" :
                                latestInteraction.contactOutcome === "conversation" ? "Conversation" : "Brief contact"}
                        </div>
                        <div className="text-default-500 line-clamp-2">
                            {latestInteraction.notes ?? (latestInteraction.blocker ? `Blocker: ${latestInteraction.blocker.replace(/_/g, " ")}` : "No notes logged.")}
                        </div>

                        {interactions.length > 1 && (
                            <button
                                onClick={() => setIsHistoryOpen(true)}
                                className="absolute bottom-3 right-3 text-primary text-xs font-semibold flex items-center gap-0.5 hover:underline"
                            >
                                View History ({interactions.length})
                                <ChevronRightIcon className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                )}

                <LeadHistoryModal
                    interactions={interactions}
                    isOpen={isHistoryOpen}
                    onOpenChange={setIsHistoryOpen}
                    leadName={lead.name}
                />
            </CardBody>
        </Card>
    );
}
