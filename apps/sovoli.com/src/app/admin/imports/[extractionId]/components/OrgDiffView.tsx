"use client";

import { Card } from "@sovoli/ui/components/card";
import { DiffField } from "./DiffField";
import { useOrgDiff } from "../hooks/useOrgDiff";
import { getNestedValue } from "../utils/object-utils";

interface OrgDiffViewProps {
	oldOrg: Record<string, unknown> | null;
	newOrg: Record<string, unknown>;
	onChange: (updatedOrg: Record<string, unknown>) => void;
}

export function OrgDiffView({ oldOrg, newOrg, onChange }: OrgDiffViewProps) {
	const {
		editedOrg,
		selectedFields,
		allDiffs,
		isNew,
		handleFieldChange,
		handleFieldSelection,
	} = useOrgDiff({ oldOrg, newOrg, onChange });

	return (
		<Card className="p-6">
			<div className="mb-4">
				<h2 className="text-xl font-semibold mb-2">
					{isNew ? "New Organization" : "Organization Updates"}
				</h2>
				{isNew ? (
					<p className="text-sm text-muted-foreground">
						This organization will be created from the extraction data. Select which fields to include.
					</p>
				) : (
					<p className="text-sm text-muted-foreground">
						Review and edit the fields that will be updated. Select which fields to include.
					</p>
				)}
			</div>

			<div className="space-y-4">
				{allDiffs.length === 0 ? (
					<p className="text-sm text-muted-foreground">No changes detected.</p>
				) : (
					allDiffs.map((diff) => {
						const value = getNestedValue(editedOrg, diff.field);

						return (
							<DiffField
								key={diff.field}
								diff={diff}
								value={value}
								onChange={(newValue) => handleFieldChange(diff.field, newValue)}
								onSelectedChange={(selected) => handleFieldSelection(diff.field, selected)}
								selected={selectedFields.has(diff.field)}
								action={isNew ? "add" : "update"}
							/>
						);
					})
				)}
			</div>
		</Card>
	);
}
