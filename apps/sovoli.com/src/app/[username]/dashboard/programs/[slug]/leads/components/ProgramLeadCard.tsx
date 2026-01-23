import { Button } from "@sovoli/ui/components/button";
import {
  ChevronRightIcon,
  MessageCircleIcon,
  PhoneIcon,
} from "lucide-react";
import type { Lead } from "~/modules/leads/types";
import type { LeadInteraction, SystemState } from "../utils/leadCategorization";

// --- Helpers ---

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
  onLogInteraction,
}: {
  phone: string;
  onLogInteraction: () => void;
}) {
  const cleanedPhone = phone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanedPhone}`;
  const telUrl = `tel:${phone.replace(/[^\d+]/g, "")}`;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLogInteraction();
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLogInteraction();
    window.location.href = telUrl;
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        as="a"
        isIconOnly
        variant="light"
        size="sm"
        color="success"
        className="text-success-600"
        onClick={handleWhatsAppClick}
      >
        <MessageCircleIcon className="w-4 h-4" />
      </Button>
      <Button
        as="a"
        isIconOnly
        variant="light"
        size="sm"
        color="primary"
        className="text-primary-600"
        onClick={handleCallClick}
      >
        <PhoneIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}

export function StatusIndicator({ state }: { state: SystemState }) {
  const colorMap = {
    "🟢": "bg-success-500",
    "🟡": "bg-warning-500",
    "⚪": "bg-default-300",
    "🔴": "bg-danger-500",
  };

  const bgColor = colorMap[state.emoji] || "bg-default-300";

  return (
    <div className={`w-2 h-2 rounded-full ${bgColor} shadow-sm flex-shrink-0`} />
  );
}

// --- Main Component ---

interface LeadCardProps {
  lead: Lead;
  systemState: SystemState;
  onCardClick: () => void;
  onUpdateClick: (leadId: string) => void;
}

export function LeadCard({
  lead,
  systemState,
  onCardClick,
  onUpdateClick,
}: LeadCardProps) {
  return (
    <button
      type="button"
      onClick={onCardClick}
      className="w-full px-3 sm:px-4 py-3 flex items-center justify-between gap-2 hover:bg-default-50 transition-colors text-left"
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <StatusIndicator state={systemState} />
        <span className="text-lg font-bold text-foreground truncate">
          {lead.name}
        </span>
      </div>
      <ActionButtons
        phone={lead.phone}
        onLogInteraction={() => onUpdateClick(lead.id)}
      />
    </button>
  );
}

interface LeadDrawerContentProps {
  lead: Lead;
  interactions: LeadInteraction[];
  systemState: SystemState;
  onViewHistory?: (leadId: string) => void;
  showProgram?: boolean;
}

export function LeadDrawerContent({
  lead,
  interactions,
  systemState: _systemState,
  onViewHistory,
  showProgram = false,
}: LeadDrawerContentProps) {
  // Get latest interaction
  const latestInteraction = interactions[0];

  // Format date nicely
  const submissionDate = new Date(lead.submittedAt).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
    },
  );

  const shouldShowProgram = showProgram && !!lead.programName;

  return (
    <div className="space-y-6">
      {/* Context Info */}
      <div
        className={`grid grid-cols-2 gap-y-3 gap-x-4 text-sm ${shouldShowProgram ? "sm:grid-cols-3" : ""}`}
      >
        {shouldShowProgram && (
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-default-400 mb-1">
              Program
            </span>
            <span className="text-foreground">{lead.programName}</span>
          </div>
        )}
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wider text-default-400 mb-1">
            Cycle
          </span>
          <span className="text-foreground">
            {lead.cycleLabel ?? "Unknown"}
          </span>
        </div>
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wider text-default-400 mb-1">
            Submitted
          </span>
          <span>{submissionDate}</span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="block text-xs font-semibold uppercase tracking-wider text-default-400 mb-1">
            Phone
          </span>
          <span className="font-mono text-foreground">{formatPhone(lead.phone)}</span>
        </div>
      </div>

      {/* Latest Activity Preview */}
      {latestInteraction && (
        <div className="relative bg-default-50 rounded-lg p-4">
          <div className="font-medium text-foreground mb-2">
            {latestInteraction.contactOutcome === "not_reached"
              ? "Did not reach"
              : latestInteraction.contactOutcome === "conversation"
                ? "Conversation"
                : "Brief contact"}
          </div>
          <div className="text-default-600">
            {latestInteraction.notes ??
              (latestInteraction.blocker
                ? `Blocker: ${latestInteraction.blocker.replace(/_/g, " ")}`
                : "No notes logged.")}
          </div>

          {interactions.length > 1 && onViewHistory && (
            <button
              type="button"
              onClick={() => onViewHistory(lead.id)}
              className="mt-3 text-primary text-sm font-semibold flex items-center gap-1 hover:underline"
            >
              View History ({interactions.length})
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface DrawerActionButtonsProps {
  phone: string;
  onLogInteraction: () => void;
}

export function DrawerActionButtons({
  phone,
  onLogInteraction,
}: DrawerActionButtonsProps) {
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

  return (
    <div className="flex gap-3 w-full">
      <Button
        as="a"
        variant="solid"
        color="success"
        size="lg"
        className="flex-1"
        startContent={<MessageCircleIcon className="w-5 h-5" />}
        onClick={handleWhatsAppClick}
      >
        WhatsApp
      </Button>
      <Button
        as="a"
        variant="solid"
        color="primary"
        size="lg"
        className="flex-1"
        startContent={<PhoneIcon className="w-5 h-5" />}
        onClick={handleCallClick}
      >
        Call
      </Button>
    </div>
  );
}
