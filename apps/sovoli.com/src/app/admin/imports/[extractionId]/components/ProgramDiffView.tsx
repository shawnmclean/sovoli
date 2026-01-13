"use client";

import { useState, useEffect } from "react";
import { Card } from "@sovoli/ui/components/card";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Select, SelectItem } from "@sovoli/ui/components/select";
import { computeDiff } from "../../utils/diff-compute";
import { DiffField } from "./DiffField";

interface ProgramDiffViewProps {
	programId: string;
	programName: string;
	oldProgram: Record<string, unknown> | null;
	oldProgramId?: string | null;
	newProgram: Record<string, unknown>;
	matchedPrograms?: Array<{ id: string; name: string; score: number }> | null;
	allExistingPrograms?: Array<{ id: string; name: string }>;
	onChange: (updatedProgram: Record<string, unknown> | null, action: "add" | "update" | null, targetProgramId?: string) => void;
}

export function ProgramDiffView({
	programId,
	programName,
	oldProgram,
	oldProgramId,
	newProgram,
	matchedPrograms,
	allExistingPrograms = [],
	onChange,
}: ProgramDiffViewProps) {
	const isNew = oldProgram === null;
	const isMatched = matchedPrograms && matchedPrograms.length > 0;

	// Compute initial default values
	const getInitialTargetProgramId = (): string | undefined => {
		if (isMatched && matchedPrograms && matchedPrograms.length > 0) {
			return matchedPrograms[0]!.id;
		}
		if (!isNew && oldProgramId) {
			return oldProgramId;
		}
		if (allExistingPrograms.length > 0) {
			return allExistingPrograms[0]!.id;
		}
		return undefined;
	};

	const getInitialAction = (): "add" | "update" | null => {
		if (isMatched && matchedPrograms && matchedPrograms.length > 0) {
			return "update";
		}
		if (!isNew && oldProgram) {
			return "update";
		}
		if (allExistingPrograms.length > 0) {
			return "update";
		}
		return "add";
	};

	const [editedProgram, setEditedProgram] = useState<Record<string, unknown>>(newProgram);
	const [isSelected, setIsSelected] = useState(true);
	const [action, setAction] = useState<"add" | "update" | null>(getInitialAction());
	const [targetProgramId, setTargetProgramId] = useState<string | undefined>(getInitialTargetProgramId());

	// Update when props change
	useEffect(() => {
		const newTargetProgramId = getInitialTargetProgramId();
		const newAction = getInitialAction();
		
		setTargetProgramId(newTargetProgramId);
		setAction(newAction);
		setIsSelected(true);
	}, [isMatched, isNew, matchedPrograms, oldProgram, oldProgramId, allExistingPrograms.length]);

	// Compute diffs
	const diffs = oldProgram ? computeDiff(oldProgram, editedProgram) : [];

	// For new programs, show all fields as "add"
	const allDiffs = isNew || !oldProgram
		? computeDiff({} as Record<string, unknown>, editedProgram)
		: diffs.filter((diff) => diff.type !== "remove");

	// Track selected fields within the program
	const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());

	// Initialize selected fields
	useEffect(() => {
		if (selectedFields.size === 0 && allDiffs.length > 0) {
			const initialSelected = new Set(allDiffs.map((diff) => diff.field));
			setSelectedFields(initialSelected);
		}
	}, [allDiffs.length]);

	// Update parent when selection or action changes
	useEffect(() => {
		if (!isSelected || !action) {
			onChange(null, null);
			return;
		}

		// Build final program with only selected fields
		const finalProgram: Record<string, unknown> = {};
		
		// If updating, start with old program data
		if (action === "update" && oldProgram) {
			Object.assign(finalProgram, oldProgram);
		}

		// Apply only selected field changes
		for (const diff of allDiffs) {
			if (selectedFields.has(diff.field)) {
				const parts = diff.field.split(".");
				let current: Record<string, unknown> = finalProgram;
				let source: Record<string, unknown> = editedProgram;
				
				// Navigate to the field location
				for (let i = 0; i < parts.length - 1; i++) {
					const part = parts[i]!;
					if (!(part in current)) {
						current[part] = {};
					}
					if (!(part in source) || typeof source[part] !== "object" || source[part] === null) {
						source[part] = {};
					}
					current = current[part] as Record<string, unknown>;
					source = source[part] as Record<string, unknown>;
				}
				
				const lastPart = parts[parts.length - 1]!;
				if (lastPart in source) {
					current[lastPart] = source[lastPart];
				}
			}
		}

		onChange(finalProgram, action, targetProgramId);
	}, [editedProgram, selectedFields, allDiffs, oldProgram, action, targetProgramId, isSelected, onChange]);

	const handleFieldChange = (field: string, value: unknown) => {
		const updated = { ...editedProgram };
		
		// Handle nested fields
		const parts = field.split(".");
		if (parts.length > 1) {
			let current: Record<string, unknown> = updated;
			for (let i = 0; i < parts.length - 1; i++) {
				const part = parts[i]!;
				if (!(part in current) || typeof current[part] !== "object" || current[part] === null) {
					current[part] = {};
				}
				current = current[part] as Record<string, unknown>;
			}
			current[parts[parts.length - 1]!] = value;
		} else {
			updated[field] = value;
		}

		setEditedProgram(updated);
	};

	const handleFieldSelection = (field: string, selected: boolean) => {
		const newSelected = new Set(selectedFields);
		if (selected) {
			newSelected.add(field);
		} else {
			newSelected.delete(field);
		}
		setSelectedFields(newSelected);
	};

	const handleProgramSelection = (selected: boolean) => {
		setIsSelected(selected);
		if (!selected) {
			setAction(null);
		} else if (!action) {
			// Set default action if none selected
			if (isMatched && matchedPrograms && matchedPrograms.length > 0) {
				setAction("update");
				setTargetProgramId(matchedPrograms[0]!.id);
			} else {
				setAction("add");
			}
		}
	};

	const handleActionChange = (newAction: "add" | "update") => {
		setAction(newAction);
		if (newAction === "update") {
			// Default to matched program if available, otherwise first existing program
			if (isMatched && matchedPrograms && matchedPrograms.length > 0) {
				setTargetProgramId(matchedPrograms[0]!.id);
			} else if (allExistingPrograms.length > 0) {
				setTargetProgramId(allExistingPrograms[0]!.id);
			}
		} else if (newAction === "add") {
			setTargetProgramId(undefined);
		}
	};

	return (
		<Card className="p-6">
			<div className="mb-4">
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center gap-3">
						<Checkbox
							isSelected={isSelected}
							onValueChange={handleProgramSelection}
						/>
						<h2 className="text-xl font-semibold">{programName}</h2>
					</div>
					{isMatched && (
						<span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
							Matched ({matchedPrograms![0]!.score.toFixed(2)})
						</span>
					)}
				</div>
				
				{isSelected && (
					<div className="mt-3 space-y-2">
						<div className="flex items-center gap-4">
							<label className="text-sm font-medium">Action:</label>
							<div className="flex gap-4">
								<label className="flex items-center gap-2 cursor-pointer">
									<input
										type="radio"
										name={`action-${programId}`}
										checked={action === "add"}
										onChange={() => handleActionChange("add")}
										className="cursor-pointer"
									/>
									<span className="text-sm">Add New Program</span>
								</label>
								<label className="flex items-center gap-2 cursor-pointer">
									<input
										type="radio"
										name={`action-${programId}`}
										checked={action === "update"}
										onChange={() => handleActionChange("update")}
										className="cursor-pointer"
										disabled={allExistingPrograms.length === 0}
									/>
									<span className="text-sm">Update Existing</span>
									{allExistingPrograms.length === 0 && (
										<span className="text-xs text-muted-foreground">(No existing programs)</span>
									)}
								</label>
							</div>
						</div>

						{action === "update" && allExistingPrograms.length > 0 && (
							<div className="flex items-center gap-4">
								<label className="text-sm font-medium">Update Program:</label>
								<Select
									selectedKeys={targetProgramId ? new Set([targetProgramId]) : new Set()}
									onSelectionChange={(keys) => {
										const selectedKey = Array.from(keys)[0];
										if (selectedKey) {
											setTargetProgramId(selectedKey as string);
										} else {
											setTargetProgramId(undefined);
										}
									}}
									className="max-w-xs"
									placeholder="Select a program to update"
									labelPlacement="outside"
								>
									{allExistingPrograms.map((program) => {
										// Highlight matched programs
										const isMatched = matchedPrograms?.some((m) => m.id === program.id);
										const match = matchedPrograms?.find((m) => m.id === program.id);
										return (
											<SelectItem key={program.id} textValue={program.name}>
												{program.name}
												{isMatched && match && (
													<span className="text-xs text-blue-600 dark:text-blue-400 ml-2">
														(Matched: {match.score.toFixed(2)})
													</span>
												)}
											</SelectItem>
										);
									})}
								</Select>
							</div>
						)}

						{action === "update" && allExistingPrograms.length === 0 && (
							<p className="text-xs text-muted-foreground">
								No existing programs found. This will create a new program.
							</p>
						)}

						{action === "update" && oldProgram && (
							<p className="text-xs text-muted-foreground">
								Updating existing program. Select which fields to update below.
							</p>
						)}

						{action === "add" && (
							<p className="text-xs text-muted-foreground">
								Creating new program. Select which fields to include below.
							</p>
						)}
					</div>
				)}
			</div>

			{isSelected && (
				<div className="space-y-4">
					{allDiffs.length === 0 ? (
						<p className="text-sm text-muted-foreground">No changes detected.</p>
					) : (
						allDiffs.map((diff) => {
							// Get the value from editedProgram, handling nested paths
							const parts = diff.field.split(".");
							let value: unknown = editedProgram;
							for (const part of parts) {
								if (
									typeof value === "object" &&
									value !== null &&
									part in value
								) {
									value = (value as Record<string, unknown>)[part];
								} else {
									value = undefined;
									break;
								}
							}

							return (
								<DiffField
									key={diff.field}
									diff={diff}
									value={value}
									onChange={(newValue) => handleFieldChange(diff.field, newValue)}
									onSelectedChange={(selected) => handleFieldSelection(diff.field, selected)}
									selected={selectedFields.has(diff.field)}
								/>
							);
						})
					)}
				</div>
			)}
		</Card>
	);
}
