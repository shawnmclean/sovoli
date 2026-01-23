"use client";

import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@sovoli/ui/components/drawer";
import { EditIcon } from "lucide-react";
import { Button } from "@sovoli/ui/components/button";
import { useMemo, useState } from "react";
import type { Lead } from "~/modules/leads/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { LeadInteractionModal } from "../../../../components/LeadInteractionModal";
import type { LeadInteraction } from "../utils/leadCategorization";
import { categorizeLead } from "../utils/leadCategorization";
import { LeadCard } from "./ProgramLeadCard";
import { LeadDrawerContent, DrawerActionButtons } from "./ProgramLeadCard";
import { LeadHistoryModal } from "./LeadHistoryModal";

interface UnifiedProgramLeadsViewProps {
  initialLeads: Lead[];
  orgInstance: OrgInstance;
  programName: string;
}

export function UnifiedProgramLeadsView({
  initialLeads,
  orgInstance,
  programName,
}: UnifiedProgramLeadsViewProps) {
  // Initialize interactions from JSON data (if present in leads)
  const initialInteractions: Record<string, LeadInteraction[]> = {};
  for (const lead of initialLeads) {
    if (lead.interactions && lead.interactions.length > 0) {
      initialInteractions[lead.id] = lead.interactions;
    }
  }

  // State for interactions (keyed by lead ID)
  // Initialize with data from JSON, can be updated via modal
  const [leadInteractions, setLeadInteractions] =
    useState<Record<string, LeadInteraction[]>>(initialInteractions);

  // Interaction Modal State
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // History Modal State
  const [historyLeadId, setHistoryLeadId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Drawer State
  const [drawerLeadId, setDrawerLeadId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Computed data for every lead
  const processedLeads = useMemo(() => {
    return initialLeads.map((lead) => {
      const interactions = leadInteractions[lead.id] ?? [];
      // Sort interactions so newest is first
      const sortedInteractions = [...interactions].sort(
        (a, b) =>
          new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime(),
      );

      const systemState = categorizeLead(lead, sortedInteractions);

      return {
        ...lead,
        interactions: sortedInteractions,
        systemState,
      };
    });
  }, [initialLeads, leadInteractions]);


  // Separate leads into lists (Active/Touched vs Untouched/NoVisibility)
  // Or just one big list sorted by importance?
  // Report page had "Leads With Activity" and "Leads Without Activity".
  // Let's replicate that structure.

  const leadsWithActivity = processedLeads
    .filter((l) => l.interactions.length > 0)
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );

  const leadsWithoutActivity = processedLeads
    .filter((l) => l.interactions.length === 0)
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );

  // Handlers
  const handleUpdateClick = (leadId: string) => {
    setSelectedLeadId(leadId);
    setIsModalOpen(true);
  };

  const handleSaveInteraction = (interaction: LeadInteraction) => {
    if (!selectedLeadId) return;

    const newInteraction = interaction;

    setLeadInteractions((prev) => {
      const existing = prev[selectedLeadId] ?? [];
      return {
        ...prev,
        [selectedLeadId]: [newInteraction, ...existing],
      };
    });

    // PostHog or other side effects handled in Modal already
  };

  const handleViewHistory = (leadId: string) => {
    setHistoryLeadId(leadId);
    setIsHistoryOpen(true);
  };

  const handleCardClick = (leadId: string) => {
    setDrawerLeadId(leadId);
    setIsDrawerOpen(true);
  };

  const selectedLead = selectedLeadId
    ? initialLeads.find((l) => l.id === selectedLeadId)
    : null;

  const historyLead = historyLeadId
    ? processedLeads.find((l) => l.id === historyLeadId)
    : null;

  const drawerLead = drawerLeadId
    ? processedLeads.find((l) => l.id === drawerLeadId)
    : null;

  const showProgramInCards = programName === "All programs";

  return (
    <div className="space-y-8">
      {/* Leads Without Activity */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-default-700 px-1">
          {leadsWithoutActivity.length > 0
            ? "New / No Activity"
            : "All leads contacted! 🎉"}
          {leadsWithoutActivity.length > 0 && (
            <span className="ml-2 text-sm font-normal text-default-400">
              ({leadsWithoutActivity.length})
            </span>
          )}
        </h2>
        {leadsWithoutActivity.length > 0 && (
          <div className="space-y-2 border border-default-200 rounded-lg divide-y divide-default-200">
            {leadsWithoutActivity.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                systemState={lead.systemState}
                onCardClick={() => handleCardClick(lead.id)}
                onUpdateClick={handleUpdateClick}
              />
            ))}
          </div>
        )}
      </section>

      {/* Leads With Activity */}
      {leadsWithActivity.length > 0 && (
        <section className="space-y-4 pt-4">
          <h2 className="text-lg font-bold text-default-700 px-1">
            Active Leads
            <span className="ml-2 text-sm font-normal text-default-400">
              ({leadsWithActivity.length})
            </span>
          </h2>
          <div className="space-y-2 border border-default-200 rounded-lg divide-y divide-default-200">
            {leadsWithActivity.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                systemState={lead.systemState}
                onCardClick={() => handleCardClick(lead.id)}
                onUpdateClick={handleUpdateClick}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      {selectedLead && (
        <LeadInteractionModal
          lead={selectedLead}
          orgInstance={orgInstance}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSave={handleSaveInteraction}
        />
      )}

      {historyLead && (
        <LeadHistoryModal
          interactions={historyLead.interactions}
          isOpen={isHistoryOpen}
          onOpenChange={setIsHistoryOpen}
          leadName={historyLead.name}
        />
      )}

      {/* Lead Details Drawer */}
      {drawerLead && (
        <Drawer
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          placement="bottom"
          size="full"
          backdrop="opaque"
          hideCloseButton
        >
          <DrawerContent>
            {(onClose) => (
              <>
                <DrawerHeader
                  title={drawerLead.name}
                  showBackButton
                  onBackPress={onClose}
                  endContent={
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      className="text-default-400"
                      onPress={() => {
                        handleUpdateClick(drawerLead.id);
                        onClose();
                      }}
                    >
                      <EditIcon className="w-5 h-5" />
                    </Button>
                  }
                />
                <DrawerBody>
                  <LeadDrawerContent
                    lead={drawerLead}
                    interactions={drawerLead.interactions}
                    systemState={drawerLead.systemState}
                    onViewHistory={handleViewHistory}
                    showProgram={showProgramInCards}
                  />
                </DrawerBody>
                <DrawerFooter>
                  <DrawerActionButtons
                    phone={drawerLead.phone}
                    onLogInteraction={() => handleUpdateClick(drawerLead.id)}
                  />
                </DrawerFooter>
              </>
            )}
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
