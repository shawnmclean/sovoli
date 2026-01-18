"use client";

import { useMemo, useState } from "react";
import { Input } from "@sovoli/ui/components/input";
import { Select, SelectItem } from "@sovoli/ui/components/select";
import { Card, CardBody } from "@sovoli/ui/components/card";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Lead } from "~/modules/leads/types";

import { categorizeLead } from "../../../programs/[slug]/leads/utils/leadCategorization";
import type { LeadInteraction } from "../../../programs/[slug]/leads/utils/leadCategorization";
import { UnifiedProgramLeadsView } from "../../../programs/[slug]/leads/components/UnifiedProgramLeadsView";

type CategoryFilter = "all" | "strong" | "uncertain" | "lowIntent" | "noVisibility";

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

  const programOptions = useMemo(() => {
    const programs = orgInstance.academicModule?.programs ?? [];
    return programs.map((p) => ({
      id: p.id,
      name: p.name ?? "Program",
    }));
  }, [orgInstance.academicModule?.programs]);

  const programOptionsWithAll = useMemo(
    () => [{ id: "all", name: "All programs" }, ...programOptions],
    [programOptions],
  );

  const statusOptions = useMemo(
    () =>
      [
        { id: "all", name: "All statuses" },
        { id: "noVisibility", name: "New / No activity" },
        { id: "uncertain", name: "Uncertain" },
        { id: "strong", name: "Strong" },
        { id: "lowIntent", name: "Low intent" },
      ] as const,
    [],
  );

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
    <div className="space-y-4">
      <Card>
        <CardBody className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              label="Search"
              placeholder="Name or phone"
              value={query}
              onValueChange={setQuery}
              variant="bordered"
            />

            <Select
              label="Program"
              items={programOptionsWithAll}
              selectedKeys={new Set([selectedProgramId])}
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0];
                setSelectedProgramId(typeof key === "string" ? key : "all");
              }}
              variant="bordered"
            >
              {(item) => (
                <SelectItem key={item.id} textValue={item.name}>
                  {item.name}
                </SelectItem>
              )}
            </Select>

            <Select
              label="Status"
              items={statusOptions}
              selectedKeys={new Set([selectedCategory])}
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0];
                setSelectedCategory(
                  (typeof key === "string" ? key : "all") as CategoryFilter,
                );
              }}
              variant="bordered"
            >
              {(item) => (
                <SelectItem key={item.id} textValue={item.name}>
                  {item.name}
                </SelectItem>
              )}
            </Select>
          </div>
        </CardBody>
      </Card>

      <UnifiedProgramLeadsView
        initialLeads={filteredLeads}
        orgInstance={orgInstance}
        programName="All programs"
      />
    </div>
  );
}

