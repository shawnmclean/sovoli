import { useReducer, useMemo } from "react";
import type { ProgramSuffix } from "../utils/suffix-utils";

interface ProgramState {
	data: Record<string, unknown> | null;
	action: "add" | "update" | null;
	targetProgramId?: string;
}

interface ReviewState {
	editedOrgData: Record<string, unknown>;
	editedPrograms: Record<string, ProgramState>;
	selectedSuffix: ProgramSuffix | null;
}

type ReviewAction =
	| { type: "SET_ORG_DATA"; payload: Record<string, unknown> }
	| {
			type: "SET_PROGRAM_DATA";
			payload: {
				programId: string;
				data: Record<string, unknown> | null;
				action: "add" | "update" | null;
				targetProgramId?: string;
			};
	  }
	| { type: "SET_SUFFIX"; payload: ProgramSuffix | null }
	| { type: "INIT_PROGRAMS"; payload: { programId: string; transformedData: Record<string, unknown>; oldProgram: Record<string, unknown> | null; matchedPrograms: { id: string; name: string; score: number }[] | null }[] };

function reviewReducer(
	state: ReviewState,
	action: ReviewAction,
): ReviewState {
	switch (action.type) {
		case "SET_ORG_DATA":
			return {
				...state,
				editedOrgData: action.payload,
			};
		case "SET_PROGRAM_DATA":
			return {
				...state,
				editedPrograms: {
					...state.editedPrograms,
					[action.payload.programId]: {
						data: action.payload.data,
						action: action.payload.action,
						targetProgramId: action.payload.targetProgramId,
					},
				},
			};
		case "SET_SUFFIX":
			return {
				...state,
				selectedSuffix: action.payload,
			};
		case "INIT_PROGRAMS": {
			const programs: Record<string, ProgramState> = {};
			for (const program of action.payload) {
				const firstMatch = program.matchedPrograms?.[0];
				programs[program.programId] = {
					data: program.transformedData,
					action: program.oldProgram ? "update" : "add",
					targetProgramId: firstMatch?.id,
				};
			}
			return {
				...state,
				editedPrograms: programs,
			};
		}
		default:
			return state;
	}
}

interface UseReviewStateProps {
	initialOrgData: Record<string, unknown>;
	initialPrograms: {
		programId: string;
		transformedData: Record<string, unknown>;
		oldProgram: Record<string, unknown> | null;
		matchedPrograms: { id: string; name: string; score: number }[] | null;
	}[];
}

export function useReviewState({
	initialOrgData,
	initialPrograms,
}: UseReviewStateProps) {
	// Initialize programs state
	const initialProgramsState: Record<string, ProgramState> = {};
	for (const program of initialPrograms) {
		const firstMatch = program.matchedPrograms?.[0];
		initialProgramsState[program.programId] = {
			data: program.transformedData,
			action: program.oldProgram ? "update" : "add",
			targetProgramId: firstMatch?.id,
		};
	}

	const [state, dispatch] = useReducer(reviewReducer, {
		editedOrgData: initialOrgData,
		editedPrograms: initialProgramsState,
		selectedSuffix: null,
	});

	const setOrgData = (data: Record<string, unknown>) => {
		dispatch({ type: "SET_ORG_DATA", payload: data });
	};

	const setProgramData = (
		programId: string,
		data: Record<string, unknown> | null,
		action: "add" | "update" | null,
		targetProgramId?: string,
	) => {
		dispatch({
			type: "SET_PROGRAM_DATA",
			payload: { programId, data, action, targetProgramId },
		});
	};

	const setSuffix = (suffix: ProgramSuffix | null) => {
		dispatch({ type: "SET_SUFFIX", payload: suffix });
	};

	// Computed values
	const programsNew = useMemo(() => {
		return Object.values(state.editedPrograms).filter(
			(p) => p.action === "add" && p.data !== null,
		).length;
	}, [state.editedPrograms]);

	const programsUpdated = useMemo(() => {
		return Object.values(state.editedPrograms).filter(
			(p) => p.action === "update" && p.data !== null,
		).length;
	}, [state.editedPrograms]);

	return {
		editedOrgData: state.editedOrgData,
		editedPrograms: state.editedPrograms,
		selectedSuffix: state.selectedSuffix,
		programsNew,
		programsUpdated,
		setOrgData,
		setProgramData,
		setSuffix,
	};
}
