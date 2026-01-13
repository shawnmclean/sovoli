"use client";

import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@sovoli/ui/components/dialog";
import { Button } from "@sovoli/ui/components/button";
import { Card } from "@sovoli/ui/components/card";

interface CommitSummary {
	orgAction: "create" | "update" | null;
	orgName: string;
	programsToCreate: Array<{ id: string; name: string }>;
	programsToUpdate: Array<{ id: string; name: string; targetId?: string }>;
}

interface CommitConfirmationModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	summary: CommitSummary;
	onConfirm: () => void;
	isCommitting: boolean;
}

export function CommitConfirmationModal({
	isOpen,
	onOpenChange,
	summary,
	onConfirm,
	isCommitting,
}: CommitConfirmationModalProps) {
	const hasChanges =
		summary.orgAction !== null ||
		summary.programsToCreate.length > 0 ||
		summary.programsToUpdate.length > 0;

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
			<ModalContent>
				<ModalHeader>
					<h2 className="text-2xl font-bold">Confirm Changes</h2>
				</ModalHeader>
				<ModalBody>
					{!hasChanges ? (
						<p className="text-muted-foreground">
							No changes to apply.
						</p>
					) : (
						<div className="space-y-4">
							{summary.orgAction && (
								<Card className="p-4">
									<h3 className="font-semibold mb-2">Organization</h3>
									<div className="space-y-1">
										{summary.orgAction === "create" ? (
											<>
												<p className="text-sm">
													<span className="font-medium">Action:</span>{" "}
													<span className="text-green-600 dark:text-green-400">
														Create New
													</span>
												</p>
												<p className="text-sm">
													<span className="font-medium">Name:</span>{" "}
													{summary.orgName}
												</p>
											</>
										) : (
											<>
												<p className="text-sm">
													<span className="font-medium">Action:</span>{" "}
													<span className="text-yellow-600 dark:text-yellow-400">
														Update Existing
													</span>
												</p>
												<p className="text-sm">
													<span className="font-medium">Organization:</span>{" "}
													{summary.orgName}
												</p>
											</>
										)}
									</div>
								</Card>
							)}

							{summary.programsToCreate.length > 0 && (
								<Card className="p-4">
									<h3 className="font-semibold mb-2">
										Programs to Create ({summary.programsToCreate.length})
									</h3>
									<ul className="list-disc list-inside space-y-1">
										{summary.programsToCreate.map((program) => (
											<li key={program.id} className="text-sm">
												{program.name}
											</li>
										))}
									</ul>
								</Card>
							)}

							{summary.programsToUpdate.length > 0 && (
								<Card className="p-4">
									<h3 className="font-semibold mb-2">
										Programs to Update ({summary.programsToUpdate.length})
									</h3>
									<ul className="list-disc list-inside space-y-1">
										{summary.programsToUpdate.map((program) => (
											<li key={program.id} className="text-sm">
												{program.name}
												{program.targetId &&
													program.targetId !== program.id && (
														<span className="text-muted-foreground ml-2">
															→ {program.targetId}
														</span>
													)}
											</li>
										))}
									</ul>
								</Card>
							)}
						</div>
					)}
				</ModalBody>
				<ModalFooter>
					<Button
						variant="light"
						onPress={() => onOpenChange(false)}
						disabled={isCommitting}
					>
						Cancel
					</Button>
					<Button
						variant="solid"
						color="primary"
						onPress={onConfirm}
						isLoading={isCommitting}
						disabled={!hasChanges || isCommitting}
					>
						{isCommitting ? "Applying..." : "Apply Changes"}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
