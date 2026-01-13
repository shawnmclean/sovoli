import { useState, useMemo, useEffect, useRef } from "react";
import { computeDiff, deepEqual } from "../../utils/diff-compute";
import { getNestedValue, setNestedValue } from "../utils/object-utils";

interface UseProgramDiffProps {
	programId: string;
	oldProgram: Record<string, unknown> | null;
	oldProgramId: string | null;
	newProgram: Record<string, unknown>;
	matchedPrograms: Array<{ id: string; name: string; score: number }> | null;
	allExistingPrograms: Array<{ id: string; name: string }>;
	onChange: (
		updatedProgram: Record<string, unknown> | null,
		action: "add" | "update" | null,
		targetProgramId?: string,
	) => void;
}

export function useProgramDiff({
	programId,
	oldProgram,
	oldProgramId,
	newProgram,
	matchedPrograms,
	allExistingPrograms,
	onChange,
}: UseProgramDiffProps) {
	const isNew = oldProgram === null;
	const isMatched = matchedPrograms && matchedPrograms.length > 0;

	// Compute initial default values
	const getInitialAction = (): "add" | "update" | null => {
		// Only default to "update" if there's a matched program or an old program
		if (isMatched && matchedPrograms && matchedPrograms.length > 0) {
			return "update";
		}
		if (!isNew && oldProgram) {
			return "update";
		}
		// Otherwise, default to "add" (even if there are existing programs available)
		return "add";
	};

	const getInitialTargetProgramId = (): string | undefined => {
		// Only set target program ID if we're updating
		const initialAction = getInitialAction();
		if (initialAction !== "update") {
			return undefined;
		}

		// If matched, use matched program
		if (isMatched && matchedPrograms && matchedPrograms.length > 0) {
			return matchedPrograms[0]!.id;
		}
		// If we have an old program ID, use it
		if (!isNew && oldProgramId) {
			return oldProgramId;
		}
		// Otherwise, if there are existing programs, use the first one
		// (user can change it via dropdown)
		if (allExistingPrograms.length > 0) {
			return allExistingPrograms[0]!.id;
		}
		return undefined;
	};

	const [editedProgram, setEditedProgram] = useState<Record<string, unknown>>(newProgram);
	const [isSelected, setIsSelected] = useState(true);
	const [action, setAction] = useState<"add" | "update" | null>(getInitialAction());
	const [targetProgramId, setTargetProgramId] = useState<string | undefined>(getInitialTargetProgramId());
	const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
	const lastNewProgramRef = useRef<string>(JSON.stringify(newProgram));
	const lastFinalProgramRef = useRef<string>("");
	const onChangeRef = useRef(onChange);
	const isInitialMountRef = useRef(true);
	const editedProgramRef = useRef<Record<string, unknown>>(newProgram);
	const hasInitializedFieldsRef = useRef(false);

	// Keep onChange ref up to date
	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	// Keep editedProgramRef in sync with editedProgram state
	useEffect(() => {
		editedProgramRef.current = editedProgram;
	}, [editedProgram]);

	// Sync editedProgram when newProgram prop changes (e.g., when suffix is applied)
	// Only sync when content actually changes, not on every render
	useEffect(() => {
		const newProgramString = JSON.stringify(newProgram);
		if (newProgramString !== lastNewProgramRef.current) {
			lastNewProgramRef.current = newProgramString;
			
			// Skip if this is just the parent echoing back what we sent via onChange
			// This happens because: we call onChange(finalProgram) -> parent sets state -> passes it back as newProgram
			if (newProgramString === lastFinalProgramRef.current) {
				return;
			}
			
			// Only update if editedProgram is different from newProgram
			if (!deepEqual(editedProgramRef.current, newProgram)) {
				setEditedProgram(newProgram);
				editedProgramRef.current = newProgram;
			}
		}
		// Mark as mounted after first effect run
		if (isInitialMountRef.current) {
			isInitialMountRef.current = false;
		}
	}, [newProgram]);

	// Update when props change - but only if action/target haven't been set by user
	useEffect(() => {
		// Only auto-update if we don't have a user-selected action yet
		// This prevents resetting user choices when props change
		if (action === null) {
			const newTargetProgramId = getInitialTargetProgramId();
			const newAction = getInitialAction();
			setTargetProgramId(newTargetProgramId);
			setAction(newAction);
		}
	}, [
		isMatched,
		isNew,
		matchedPrograms,
		oldProgram,
		oldProgramId,
		allExistingPrograms.length,
		action,
	]);

	// Compute diffs - memoized
	const allDiffs = useMemo(() => {
		if (isNew || !oldProgram) {
			return computeDiff({} as Record<string, unknown>, editedProgram);
		}
		const diffs = computeDiff(oldProgram, editedProgram);
		return diffs.filter((diff) => diff.type !== "remove");
	}, [editedProgram, oldProgram, isNew]);

	// Initialize selected fields - all selected by default (only once)
	useEffect(() => {
		if (!hasInitializedFieldsRef.current && allDiffs.length > 0) {
			const initialSelected = new Set(allDiffs.map((diff) => diff.field));
			setSelectedFields(initialSelected);
			hasInitializedFieldsRef.current = true;
		}
	}, [allDiffs.length]);

	// Compute final program data based on selections - memoized
	const finalProgram = useMemo(() => {
		if (!isSelected || !action) {
			return null;
		}

		// Build final program with only selected fields
		const result: Record<string, unknown> = {};

		// If updating, start with old program data
		if (action === "update" && oldProgram) {
			Object.assign(result, oldProgram);
		}

		// Apply only selected field changes
		for (const diff of allDiffs) {
			if (selectedFields.has(diff.field)) {
				const parts = diff.field.split(".");
				let current: Record<string, unknown> = result;
				let source: Record<string, unknown> = editedProgram;

				// Navigate to the field location
				for (let i = 0; i < parts.length - 1; i++) {
					const part = parts[i]!;
					if (!(part in current)) {
						current[part] = {};
					}
					if (
						!(part in source) ||
						typeof source[part] !== "object" ||
						source[part] === null
					) {
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

		return result;
	}, [editedProgram, selectedFields, allDiffs, oldProgram, action, isSelected]);

	// Update parent when final program, action, or target changes
	useEffect(() => {
		if (finalProgram === null) {
			lastFinalProgramRef.current = "";
			onChangeRef.current(null, null);
			return;
		}
		lastFinalProgramRef.current = JSON.stringify(finalProgram);
		onChangeRef.current(finalProgram, action, targetProgramId);
	}, [finalProgram, action, targetProgramId]);

	const handleFieldChange = (field: string, value: unknown) => {
		const updated = { ...editedProgram };

		// Handle nested fields
		const parts = field.split(".");
		if (parts.length > 1) {
			let current: Record<string, unknown> = updated;
			for (let i = 0; i < parts.length - 1; i++) {
				const part = parts[i]!;
				if (
					!(part in current) ||
					typeof current[part] !== "object" ||
					current[part] === null
				) {
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

	return {
		editedProgram,
		isSelected,
		action,
		targetProgramId,
		selectedFields,
		allDiffs,
		isNew,
		isMatched,
		handleFieldChange,
		handleFieldSelection,
		handleProgramSelection,
		handleActionChange,
		setTargetProgramId,
	};
}
