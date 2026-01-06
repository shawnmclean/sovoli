"use client";

import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { TimeAgo } from "@sovoli/ui/components/time-ago";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Program, ProgramCycle } from "~/modules/academics/types";

export interface Lead {
	id: string;
	name: string;
	phone: string;
	programId: string;
	cycleId: string;
	submittedAt: string;
}

interface LeadsTableProps {
	leads: Lead[];
	orgInstance: OrgInstance;
}

/**
 * Helper function to find a program by ID from orgInstance
 */
function getProgramById(
	orgInstance: OrgInstance,
	programId: string,
): Program | undefined {
	if (!orgInstance.academicModule?.programs) {
		return undefined;
	}
	return orgInstance.academicModule.programs.find(
		(program) => program.id === programId,
	);
}

/**
 * Helper function to find a program cycle by ID
 */
function getCycleById(
	program: Program | undefined,
	cycleId: string,
): ProgramCycle | undefined {
	if (!program?.cycles) {
		return undefined;
	}
	return program.cycles.find((cycle) => cycle.id === cycleId);
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
 * Helper function to format phone number for display
 */
function formatPhone(phone: string): string {
	// Remove any non-digit characters except +
	const cleaned = phone.replace(/[^\d+]/g, "");
	// Format Jamaican numbers (+1876) or keep as is
	if (cleaned.startsWith("+1876") && cleaned.length === 11) {
		return `+1 (876) ${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
	}
	return phone;
}

export function LeadsTable({ leads, orgInstance }: LeadsTableProps) {
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
		<Card>
			<CardHeader>
				<h2 className="text-xl font-bold">Program Leads</h2>
				<p className="text-sm text-default-500">
					{leads.length} {leads.length === 1 ? "lead" : "leads"}
				</p>
			</CardHeader>
			<CardBody>
				<div className="overflow-x-auto">
					<table className="w-full min-w-[600px]">
						<thead>
							<tr className="border-b border-default-200">
								<th className="text-left py-2 px-3 text-sm font-semibold text-default-600">
									Name
								</th>
								<th className="text-left py-2 px-3 text-sm font-semibold text-default-600">
									Phone
								</th>
								<th className="text-left py-2 px-3 text-sm font-semibold text-default-600">
									Program
								</th>
								<th className="text-left py-2 px-3 text-sm font-semibold text-default-600">
									Cycle
								</th>
								<th className="text-left py-2 px-3 text-sm font-semibold text-default-600">
									Submitted
								</th>
							</tr>
						</thead>
						<tbody>
							{leads.map((lead) => {
								const program = getProgramById(orgInstance, lead.programId);
								const cycle = getCycleById(program, lead.cycleId);
								const programName = program?.name ?? lead.programId;
								const cycleLabel = getCycleLabel(cycle);

								return (
									<tr
										key={lead.id}
										className="border-b border-default-100 hover:bg-default-50"
									>
										<td className="py-3 px-3 text-sm">{lead.name}</td>
										<td className="py-3 px-3 text-sm font-mono">
											{formatPhone(lead.phone)}
										</td>
										<td className="py-3 px-3 text-sm">{programName}</td>
										<td className="py-3 px-3 text-sm text-default-600">
											{cycleLabel}
										</td>
										<td className="py-3 px-3 text-sm">
											<TimeAgo
												datetime={new Date(lead.submittedAt)}
												className="text-default-500"
											/>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</CardBody>
		</Card>
	);
}
