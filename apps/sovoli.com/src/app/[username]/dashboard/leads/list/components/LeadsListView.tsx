"use client";

import { useMemo, useState } from "react";
import type { Lead } from "~/modules/leads/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { UnifiedProgramLeadsView } from "../../../programs/[slug]/leads/components/UnifiedProgramLeadsView";
import type { LeadInteraction } from "../../../programs/[slug]/leads/utils/leadCategorization";
import { categorizeLead } from "../../../programs/[slug]/leads/utils/leadCategorization";
import { LeadsFilter, type CategoryFilter } from "./LeadsFilter";

export function LeadsListView({
  initialLeads,
  orgInstance,
}: {
  initialLeads: Lead[];
  orgInstance: OrgInstance;
}) {
  const [query, setQuery] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");

  const programCycleIdSet = useMemo(() => {
    if (selectedProgramId === "all") return null;

    const program = (orgInstance.academicModule?.programs ?? []).find(
      (p) => p.id === selectedProgramId,
    );
    if (!program) return null;

    return new Set((program.cycles ?? []).map((c) => c.id));
  }, [orgInstance.academicModule?.programs, selectedProgramId]);

  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return initialLeads.filter((lead) => {
      // Program filter
      if (selectedProgramId !== "all") {
        const matchesProgramId =
          lead.programId && lead.programId === selectedProgramId;
        const matchesCycle =
          !!programCycleIdSet && programCycleIdSet.has(lead.cycleId);
        if (!matchesProgramId && !matchesCycle) return false;
      }

      // Category filter (derived from latest interaction)
      if (selectedCategory !== "all") {
        const interactions = (lead.interactions ?? []) as LeadInteraction[];
        const systemState = categorizeLead(lead, interactions);
        if (systemState.category !== selectedCategory) return false;
      }

      // Search
      if (normalizedQuery.length > 0) {
        const haystack = `${lead.name} ${lead.phone}`.toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }

      return true;
    });
  }, [
    initialLeads,
    programCycleIdSet,
    query,
    selectedCategory,
    selectedProgramId,
  ]);

  return (
    <div className="flex flex-col">
      <LeadsFilter
        orgInstance={orgInstance}
        query={query}
        selectedProgramId={selectedProgramId}
        selectedCategory={selectedCategory}
        onQueryChange={setQuery}
        onProgramChange={setSelectedProgramId}
        onCategoryChange={setSelectedCategory}
      />

      <div className="mx-auto w-full max-w-5xl p-4">
        <UnifiedProgramLeadsView
          initialLeads={filteredLeads}
          orgInstance={orgInstance}
          programName="All programs"
        />
      </div>
    </div>
  );
}
