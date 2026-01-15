import { notFound } from "next/navigation";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { bus } from "~/services/core/bus";
import { parseLeadsModule } from "~/modules/data/organisations/utils/parseLeadsModule";
import { UnifiedProgramLeadsView } from "./components/UnifiedProgramLeadsView";
import type { Program } from "~/modules/academics/types";
import type { Lead } from "../../../components/LeadsTable";

// Import data directly for now (mimicking dashboard/page.tsx)
import healingEmeraldLeadsData from "~/modules/data/organisations/vocational-school/jamaica/healingemeraldwellness/leads.json";

interface Props {
    params: Promise<{ username: string; slug: string }>;
}

export default async function ProgramLeadsPage({ params }: Props) {
    const { username, slug } = await params;

    // 1. Fetch Org Instance
    const result = await bus.queryProcessor.execute(
        new GetOrgInstanceByUsernameQuery(username)
    );

    const orgInstance = result.orgInstance;

    if (!orgInstance) {
        return notFound();
    }

    // 2. Find Program
    const program = orgInstance.academicModule?.programs?.find(
        (p: Program) => p.slug === slug
    );

    if (!program) {
        return notFound();
    }

    // 3. Load Leads Data
    if (username !== "healingemeraldwellness") {
        return (
            <div className="p-8 text-center text-default-500">
                Leads data not configured for this organization.
            </div>
        );
    }

    const leadsModule = parseLeadsModule(healingEmeraldLeadsData);
    const allLeads = leadsModule.leads;

    // 4. Filter Leads for this Program
    const programLeads = allLeads.filter((lead: Lead) => {
        if (lead.programId === program.id) return true;

        if (program.cycles && lead.cycleId) {
            return program.cycles.some((cycle: any) => cycle.id === lead.cycleId);
        }

        return false;
    });

    // Enhance leads with cycle labels for display
    const enhancedLeads = programLeads.map(lead => {
        const cycle = program.cycles?.find(c => c.id === lead.cycleId);
        const label = cycle?.academicCycle.customLabel ??
            cycle?.academicCycle.globalCycle?.label ??
            lead.cycleId;
        return {
            ...lead,
            cycleLabel: label,
            programName: program.name
        };
    });

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">
                    {program.name} – Lead Report
                </h1>
                <p className="text-default-500">
                    {enhancedLeads.length} total leads
                </p>
            </div>

            <UnifiedProgramLeadsView
                initialLeads={enhancedLeads}
                orgInstance={orgInstance}
                programName={program.name ?? "Program"}
            />
        </div>
    );
}
