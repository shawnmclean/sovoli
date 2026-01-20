"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@sovoli/ui/components/button";
import { Card } from "@sovoli/ui/components/card";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import { OrgDiffView } from "./OrgDiffView";
import { ProgramDiffView } from "./ProgramDiffView";
import { ProgramConfiguration } from "./ProgramConfiguration";
import { ReviewSummary } from "./ReviewSummary";
import { CommitConfirmationModal } from "./CommitConfirmationModal";
import type { CommitSummary } from "./CommitConfirmationModal";
import { replaceSuffix } from "../utils/suffix-utils";
import { useReviewState } from "../hooks/useReviewState";
import {
	saveOrgChanges,
	saveProgramChanges,
	createNewOrg,
	createNewProgram,
	markExtractionApplied,
} from "../../actions";
import type { ProgramEvidence } from "../../types/lead-extraction-schema";

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
	programsData: {
		programId: string;
		programName: string;
		transformedData: Record<string, unknown>;
		oldProgram: Record<string, unknown> | null;
		oldProgramId: string | null;
		matchedPrograms: { id: string; name: string; score: number }[] | null;
		schedule: { dates?: string[] } | null;
		pricing: Record<string, unknown> | null;
	}[];
	allExistingPrograms: { id: string; name: string }[];
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

	// Centralized state management
	const {
		editedOrgData,
		editedPrograms,
		selectedSuffix,
		programsNew,
		programsUpdated,
		setOrgData,
		setProgramData,
		setSuffix,
	} = useReviewState({
		initialOrgData: transformedOrgData,
		initialPrograms: programsData.map((p) => ({
			programId: p.programId,
			transformedData: p.transformedData,
			oldProgram: p.oldProgram,
			matchedPrograms: p.matchedPrograms,
		})),
	});

	// Modal state
	const { isOpen, onOpen, onClose } = useDisclosure();

	// Loading and error states
	const [isCommitting, setIsCommitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	// Compute summary for modal
	const commitSummary = useMemo<CommitSummary>(() => {
		const programsToCreate: { id: string; name: string }[] = [];
		const programsToUpdate: { id: string; name: string; targetId?: string }[] = [];

		for (const program of programsData) {
			const programInfo = editedPrograms[program.programId];
			if (!programInfo?.data || !programInfo.action) continue;

			if (programInfo.action === "add") {
				programsToCreate.push({
					id: program.programId,
					name: program.programName,
				});
			} else {
				const targetProgramId =
					programInfo.targetProgramId ??
					(program.matchedPrograms?.length
						? program.matchedPrograms[0]?.id
						: program.programId);
				programsToUpdate.push({
					id: program.programId,
					name: program.programName,
					targetId: targetProgramId !== program.programId ? targetProgramId : undefined,
				});
			}
		}

		return {
			orgAction: (isNewOrg ? "create" : (matchedOrg ? "update" : null)),
			orgName: businessName,
			programsToCreate,
			programsToUpdate,
		};
	}, [isNewOrg, matchedOrg, businessName, programsData, editedPrograms]);

	const handleCommitClick = () => {
		onOpen();
	};

	const handleConfirmCommit = async () => {
		setIsCommitting(true);
		setError(null);
		setSuccess(false);
		onClose(); // Close modal

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
					throw new Error(result.error ?? "Failed to create organization");
				}

				// Save programs for new org
				if (result.orgDir) {
					for (const program of programsData) {
						const programInfo = editedPrograms[program.programId];
						if (programInfo?.data && programInfo.action === "add") {
							// Get schedule and pricing from edited program data
							const editedSchedule = programInfo.data._extractedSchedule as { dates?: string[] } | null;
							const editedPricing = programInfo.data._extractedPricing as ProgramEvidence["pricing"] | null;
							
							const programResult = await createNewProgram(
								result.orgDir,
								{
									...programInfo.data,
									id: program.programId,
									slug: program.programName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
								},
								extractionFilename,
								editedSchedule ?? program.schedule,
								(editedPricing ?? program.pricing) as ProgramEvidence["pricing"],
							);

							if (!programResult.success) {
								console.error(
									`Failed to create program ${program.programId}:`,
									programResult.error,
								);
							}
						}
					}
				}
			} else {
				// Update existing org
				if (!matchedOrg) {
					throw new Error("Matched organization is required for update");
				}

				const orgResult = await saveOrgChanges(
					matchedOrg.orgId,
					editedOrgData,
					extractionFilename,
				);

				if (!orgResult.success) {
					throw new Error(orgResult.error ?? "Failed to save organization");
				}

				// Save programs
				for (const program of programsData) {
					const programInfo = editedPrograms[program.programId];
					if (!programInfo?.data || !programInfo.action) continue;

					if (programInfo.action === "add") {
						// Get schedule and pricing from edited program data
						const editedSchedule = programInfo.data._extractedSchedule as { dates?: string[] } | null;
						const editedPricing = programInfo.data._extractedPricing as ProgramEvidence["pricing"] | null;
						
						const programResult = await createNewProgram(
							matchedOrg.orgDir,
							{
								...programInfo.data,
								id: program.programId,
								slug: program.programName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
							},
							extractionFilename,
							editedSchedule ?? program.schedule,
							(editedPricing ?? program.pricing) as ProgramEvidence["pricing"],
						);

						if (!programResult.success) {
							console.error(
								`Failed to create program ${program.programId}:`,
								programResult.error,
							);
						}
					} else {
						// Use the target program ID if specified, otherwise use matched or extraction ID
						const targetProgramId =
							programInfo.targetProgramId ??
							(program.matchedPrograms?.length
								? program.matchedPrograms[0]?.id
								: program.programId);

						if (!targetProgramId) continue;

						// Get schedule and pricing from edited program data
						const editedSchedule = programInfo.data._extractedSchedule as { dates?: string[] } | null;
						const editedPricing = programInfo.data._extractedPricing as ProgramEvidence["pricing"] | null;
						
						const programResult = await saveProgramChanges(
							matchedOrg.orgDir,
							targetProgramId,
							programInfo.data,
							extractionFilename,
							editedSchedule ?? program.schedule,
							(editedPricing ?? program.pricing) as ProgramEvidence["pricing"],
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

			// Mark extraction as applied
			const markResult = await markExtractionApplied(extractionId);
			if (!markResult.success) {
				console.warn(
					`Failed to mark extraction as applied: ${markResult.error}`,
				);
				// Don't fail the whole operation if marking fails
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
					onChange={setOrgData}
				/>

				<div className="space-y-4">
					<h2 className="text-2xl font-semibold">Programs</h2>
					
					<ProgramConfiguration
						selectedSuffix={selectedSuffix}
						onSuffixChange={setSuffix}
						onApplyToAllPrograms={(suffix) => {
							// Apply suffix to all programs
							for (const program of programsData) {
								const currentData = editedPrograms[program.programId]?.data ?? program.transformedData;
								const currentName = (currentData.name as string) || program.programName;

								if (typeof currentName === "string" && currentName.trim()) {
									const newName = replaceSuffix(currentName, suffix);
									const existingState = editedPrograms[program.programId];
									
									// Only update if the name actually changed
									if (newName !== currentName) {
										setProgramData(
											program.programId,
											{
												...currentData,
												name: newName,
											},
											existingState?.action ?? (program.oldProgram ? "update" : "add"),
											existingState?.targetProgramId,
										);
									}
								}
							}
						}}
					/>

					{programsData.map((program) => (
						<ProgramDiffView
							key={program.programId}
							programId={program.programId}
							programName={program.programName}
							oldProgram={program.oldProgram}
							oldProgramId={program.oldProgramId}
							newProgram={editedPrograms[program.programId]?.data ?? program.transformedData}
							matchedPrograms={program.matchedPrograms}
							allExistingPrograms={allExistingPrograms}
							schedule={program.schedule}
							pricing={program.pricing}
							onChange={(updated, action, targetProgramId) => {
								setProgramData(program.programId, updated, action ?? null, targetProgramId);
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
					onClick={handleCommitClick}
					variant="solid"
					color="primary"
					disabled={isCommitting || success}
					isLoading={isCommitting}
				>
					{isCommitting ? "Committing..." : "Commit Changes"}
				</Button>
			</div>
			</div>

		<CommitConfirmationModal
			isOpen={isOpen}
			onOpenChange={(open) => {
				if (open) {
					onOpen();
				} else {
					onClose();
				}
			}}
			summary={commitSummary}
			onConfirm={handleConfirmCommit}
			isCommitting={isCommitting}
		/>
		</div>
	);
}
