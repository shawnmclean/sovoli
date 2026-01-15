"use client";

import { useState, useMemo } from "react";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Lead } from "../../../../components/LeadsTable";
import { LeadInteractionModal } from "../../../../components/LeadInteractionModal";
import { LeadsSummaryCards, type LeadsSummaryStats } from "./LeadsSummaryCards";
import { ProgramLeadCard } from "./ProgramLeadCard";
import { categorizeLead, type LeadInteraction, type SystemState } from "../utils/leadCategorization";

interface UnifiedProgramLeadsViewProps {
    initialLeads: Lead[];
    orgInstance: OrgInstance;
    programName: string;
}

export function UnifiedProgramLeadsView({
    initialLeads,
    orgInstance,
    programName
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
    const [leadInteractions, setLeadInteractions] = useState<
        Record<string, LeadInteraction[]>
    >(initialInteractions);

    // Interaction Modal State
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Computed data for every lead
    const processedLeads = useMemo(() => {
        return initialLeads.map((lead) => {
            const interactions = leadInteractions[lead.id] || [];
            // Sort interactions so newest is first
            const sortedInteractions = [...interactions].sort(
                (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
            );

            const systemState = categorizeLead(lead, sortedInteractions);

            return {
                ...lead,
                interactions: sortedInteractions,
                systemState
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
            if (lead.systemState.category === "strong") s.strong++;
            else if (lead.systemState.category === "uncertain") s.uncertain++;
            else if (lead.systemState.category === "lowIntent") s.lowIntent++;
            else if (lead.systemState.category === "noVisibility") s.noVisibility++;
        }

        return s;
    }, [processedLeads]);

    // Separate leads into lists (Active/Touched vs Untouched/NoVisibility)
    // Or just one big list sorted by importance?
    // Report page had "Leads With Activity" and "Leads Without Activity".
    // Let's replicate that structure.

    const leadsWithActivity = processedLeads.filter(
        l => l.interactions.length > 0
    );

    const leadsWithoutActivity = processedLeads.filter(
        l => l.interactions.length === 0
    );

    // Handlers
    const handleUpdateClick = (leadId: string) => {
        setSelectedLeadId(leadId);
        setIsModalOpen(true);
    };

    const handleSaveInteraction = (interaction: any) => { // Type as any to match LeadInteractionModal signature slightly differing
        if (!selectedLeadId) return;

        // Force cast or transform if needed. Assuming compatibility.
        const newInteraction = interaction as LeadInteraction; // Cast for now

        setLeadInteractions(prev => {
            const existing = prev[selectedLeadId] || [];
            return {
                ...prev,
                [selectedLeadId]: [newInteraction, ...existing]
            };
        });

        // PostHog or other side effects handled in Modal already
    };

    const selectedLead = selectedLeadId
        ? initialLeads.find(l => l.id === selectedLeadId)
        : null;

    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <section>
                <LeadsSummaryCards stats={stats} />
            </section>

            {/* Leads With Activity */}
            {leadsWithActivity.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Leads With Activity</h2>
                    <div className="space-y-4">
                        {leadsWithActivity.map((lead, idx) => (
                            <ProgramLeadCard
                                key={lead.id}
                                lead={lead}
                                index={idx}
                                interactions={lead.interactions}
                                systemState={lead.systemState}
                                onUpdateClick={handleUpdateClick}
                                programName={programName}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Leads Without Activity */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">
                    {leadsWithoutActivity.length > 0
                        ? "Leads With No Logged Activity (Status Unknown)"
                        : "All leads have been contacted! 🎉"}
                </h2>
                {leadsWithoutActivity.length > 0 && (
                    <div className="space-y-4">
                        {leadsWithoutActivity.map((lead, idx) => (
                            <ProgramLeadCard
                                key={lead.id}
                                lead={lead}
                                index={leadsWithActivity.length + idx} // Continue numbering
                                interactions={lead.interactions}
                                systemState={lead.systemState}
                                onUpdateClick={handleUpdateClick}
                                programName={programName}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Modal */}
            {selectedLead && (
                <LeadInteractionModal
                    lead={selectedLead}
                    orgInstance={orgInstance}
                    isOpen={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    // @ts-ignore - aligning types between local def and modal export
                    onSave={handleSaveInteraction}
                />
            )}
        </div>
    );
}
