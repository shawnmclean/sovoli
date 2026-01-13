"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@sovoli/ui/components/button";
import { Card } from "@sovoli/ui/components/card";
import { OrgDiffView } from "./OrgDiffView";
import { ProgramDiffView } from "./ProgramDiffView";
import { ReviewSummary } from "./ReviewSummary";
import {
	saveOrgChanges,
	saveProgramChanges,
	createNewOrg,
	createNewProgram,
} from "../../actions";

interface ReviewPageClientProps {
	extractionId: string;
	businessName: string;
	isNewOrg: boolean;
	matchedOrg: {
		orgId: string;
		orgDir: string;
		orgData: Record<string, unknown>;
	} | null;
	transformedOrgData: Record<string, unknown>;
	oldOrgData: Record<string, unknown> | null;
	programsData: Array<{
		programId: string;
		programName: string;
		transformedData: Record<string, unknown>;
		oldProgram: Record<string, unknown> | null;
		oldProgramId: string | null;
		matchedPrograms: Array<{ id: string; name: string; score: number }> | null;
	}>;
	allExistingPrograms: Array<{ id: string; name: string }>;
}

export function ReviewPageClient({
	extractionId,
	businessName,
	isNewOrg,
	matchedOrg,
	transformedOrgData,
	oldOrgData,
	programsData,
	allExistingPrograms,
}: ReviewPageClientProps) {
	const router = useRouter();

	// State for edited data
	const [editedOrgData, setEditedOrgData] = useState<Record<string, unknown>>(
		transformedOrgData,
	);
	const [editedPrograms, setEditedPrograms] = useState<
		Record<string, { data: Record<string, unknown> | null; action: "add" | "update" | null; targetProgramId?: string }>
	>(() => {
		const programs: Record<string, { data: Record<string, unknown> | null; action: "add" | "update" | null; targetProgramId?: string }> = {};
		for (const program of programsData) {
			programs[program.programId] = {
				data: program.transformedData,
				action: program.oldProgram ? "update" : "add",
				targetProgramId: program.matchedPrograms && program.matchedPrograms.length > 0 ? program.matchedPrograms[0]!.id : undefined,
			};
		}
		return programs;
	});

	// Track which programs are selected and their actions
	const programsNew = Object.values(editedPrograms).filter((p) => p.action === "add" && p.data !== null).length;
	const programsUpdated = Object.values(editedPrograms).filter((p) => p.action === "update" && p.data !== null).length;

	// Loading and error states
	const [isCommitting, setIsCommitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleCommit = async () => {
		setIsCommitting(true);
		setError(null);
		setSuccess(false);

		try {
			const extractionFilename = `${extractionId}-extraction.json`;

			// Handle organization
			if (isNewOrg) {
				// For new orgs, we need category, country, region
				// For now, prompt or use defaults - this should be enhanced with a form
				const category = "vocational-school"; // Default, should be configurable
				const country = "jamaica"; // Default, should be configurable
				const region = undefined; // Optional

				// Add username to org data (slugified from name)
				const username = businessName
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/^-+|-+$/g, "");

				const orgDataWithUsername = {
					...editedOrgData,
					username,
				};

				const result = await createNewOrg(
					orgDataWithUsername,
					category,
					country,
					region,
					extractionFilename,
				);

				if (!result.success) {
					throw new Error(result.error || "Failed to create organization");
				}

				// Save programs for new org
				for (const program of programsData) {
					const programInfo = editedPrograms[program.programId];
					if (programInfo && programInfo.data && programInfo.action === "add") {
						const programResult = await createNewProgram(
							result.orgDir!,
							{
								...programInfo.data,
								id: program.programId,
								slug: program.programName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
							},
							extractionFilename,
						);

						if (!programResult.success) {
							console.error(
								`Failed to create program ${program.programId}:`,
								programResult.error,
							);
						}
					}
				}
			} else {
				// Update existing org
				const orgResult = await saveOrgChanges(
					matchedOrg!.orgId,
					editedOrgData,
					extractionFilename,
				);

				if (!orgResult.success) {
					throw new Error(orgResult.error || "Failed to save organization");
				}

				// Save programs
				for (const program of programsData) {
					const programInfo = editedPrograms[program.programId];
					if (!programInfo || !programInfo.data || !programInfo.action) continue;

					if (programInfo.action === "add") {
						const programResult = await createNewProgram(
							matchedOrg!.orgDir,
							{
								...programInfo.data,
								id: program.programId,
								slug: program.programName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
							},
							extractionFilename,
						);

						if (!programResult.success) {
							console.error(
								`Failed to create program ${program.programId}:`,
								programResult.error,
							);
						}
					} else if (programInfo.action === "update") {
						// Use the target program ID if specified, otherwise use matched or extraction ID
						const targetProgramId = programInfo.targetProgramId ||
							(program.matchedPrograms && program.matchedPrograms.length > 0
								? program.matchedPrograms[0]!.id
								: program.programId);

						const programResult = await saveProgramChanges(
							matchedOrg!.orgDir,
							targetProgramId,
							programInfo.data,
							extractionFilename,
						);

						if (!programResult.success) {
							console.error(
								`Failed to save program ${targetProgramId}:`,
								programResult.error,
							);
						}
					}
				}
			}

			setSuccess(true);
			setTimeout(() => {
				router.push("/admin/imports");
			}, 2000);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsCommitting(false);
		}
	};

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="max-w-6xl mx-auto space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold mb-2">Review Import</h1>
						<p className="text-muted-foreground">
							Extraction: <code className="text-sm">{extractionId}</code>
						</p>
					</div>
					<Link href="/admin/imports">
						<Button variant="light">
							Back to Imports
						</Button>
					</Link>
				</div>

				{error && (
					<Card className="p-4 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
						<p className="text-red-800 dark:text-red-200">{error}</p>
					</Card>
				)}

				{success && (
					<Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
						<p className="text-green-800 dark:text-green-200">
							Successfully committed changes! Redirecting...
						</p>
					</Card>
				)}

				<ReviewSummary
					orgType={isNewOrg ? "new" : "update"}
					orgName={businessName}
					programsCount={programsData.length}
					programsNew={programsNew}
					programsUpdated={programsUpdated}
				/>

				<OrgDiffView
					oldOrg={oldOrgData}
					newOrg={editedOrgData}
					onChange={setEditedOrgData}
				/>

				<div className="space-y-4">
					<h2 className="text-2xl font-semibold">Programs</h2>
					{programsData.map((program) => (
						<ProgramDiffView
							key={program.programId}
							programId={program.programId}
							programName={program.programName}
							oldProgram={program.oldProgram}
							oldProgramId={program.oldProgramId}
							newProgram={editedPrograms[program.programId]?.data || program.transformedData}
							matchedPrograms={program.matchedPrograms}
							allExistingPrograms={allExistingPrograms}
							onChange={(updated, action, targetProgramId) => {
								setEditedPrograms((prev) => ({
									...prev,
									[program.programId]: {
										data: updated,
										action: action || null,
										targetProgramId,
									},
								}));
							}}
						/>
					))}
				</div>

			<div className="flex justify-end gap-4 pt-4 border-t">
				<Link href="/admin/imports">
					<Button
						variant="light"
						disabled={isCommitting}
					>
						Cancel
					</Button>
				</Link>
				<Button
					onClick={handleCommit}
					variant="solid"
					color="primary"
					disabled={isCommitting || success}
					isLoading={isCommitting}
				>
					{isCommitting ? "Committing..." : "Commit Changes"}
				</Button>
			</div>
			</div>
		</div>
	);
}
