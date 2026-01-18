"use client";

import { useState, useMemo } from "react";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Lead } from "../../../../components/LeadsTable";
import { LeadInteractionModal } from "../../../../components/LeadInteractionModal";
import type { LeadsSummaryStats } from "./LeadsSummaryCards";
import { LeadsSummaryCards } from "./LeadsSummaryCards";
import { ProgramLeadCard } from "./ProgramLeadCard";
import type { LeadInteraction } from "../utils/leadCategorization";
import { categorizeLead } from "../utils/leadCategorization";

interface UnifiedProgramLeadsViewProps {
  initialLeads: Lead[];
  orgInstance: OrgInstance;
  programName: string;
}

export function UnifiedProgramLeadsView({
  initialLeads,
  orgInstance,
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

  // Derived Stats
  const stats: LeadsSummaryStats = useMemo(() => {
    const s = {
      strong: 0,
      uncertain: 0,
      lowIntent: 0,
      noVisibility: 0,
    };

    for (const lead of processedLeads) {
      const category = lead.systemState.category;
      if (category === "strong") s.strong++;
      else if (category === "uncertain") s.uncertain++;
      else if (category === "lowIntent") s.lowIntent++;
      else s.noVisibility++;
      // All categories are handled above, this is exhaustive
    }

    return s;
  }, [processedLeads]);

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

  const selectedLead = selectedLeadId
    ? initialLeads.find((l) => l.id === selectedLeadId)
    : null;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <section>
        <LeadsSummaryCards stats={stats} />
      </section>

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
          <div className="space-y-3">
            {leadsWithoutActivity.map((lead) => (
              <ProgramLeadCard
                key={lead.id}
                lead={lead}
                interactions={lead.interactions}
                systemState={lead.systemState}
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
          <div className="space-y-3">
            {leadsWithActivity.map((lead) => (
              <ProgramLeadCard
                key={lead.id}
                lead={lead}
                interactions={lead.interactions}
                systemState={lead.systemState}
                onUpdateClick={handleUpdateClick}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modal */}
      {selectedLead && (
        <LeadInteractionModal
          lead={selectedLead}
          orgInstance={orgInstance}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSave={handleSaveInteraction}
        />
      )}
    </div>
  );
}
