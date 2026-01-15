"use client";

import React from "react";
import { useDisclosure } from "@sovoli/ui/components/dialog";
import { Button } from "@sovoli/ui/components/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@sovoli/ui/components/dialog";

export interface InteractionHistory {
  timestamp: string;
  contactOutcome: string;
  interestLevel?: string;
  blocker?: string;
  nextAction?: string;
  notReachedReason?: string;
  notes?: string;
}

interface InteractionHistoryModalProps {
  leadName: string;
  interactionHistory: InteractionHistory[];
}

export function InteractionHistoryModal({
  leadName,
  interactionHistory,
}: InteractionHistoryModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        variant="bordered"
        size="sm"
        onPress={onOpen}
        className="w-full sm:w-auto"
      >
        View Interaction History ({interactionHistory.length} update
        {interactionHistory.length !== 1 ? "s" : ""})
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        scrollBehavior="inside"
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold">
                  Interaction History: {leadName}
                </h2>
                <p className="text-sm text-default-500 font-normal">
                  {interactionHistory.length} interaction
                  {interactionHistory.length !== 1 ? "s" : ""} logged
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  {interactionHistory.map((interaction, idx) => (
                    <div
                      key={idx}
                      className="rounded-md border border-default-200 bg-default-50 p-4 text-sm"
                    >
                      <div className="mb-3 font-semibold text-default-700 text-base">
                        {interaction.timestamp}
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <span className="font-medium">Contact Outcome:</span>{" "}
                          <span className="capitalize">
                            {interaction.contactOutcome.replace(/_/g, " ")}
                          </span>
                        </div>
                        {interaction.interestLevel && (
                          <div>
                            <span className="font-medium">Interest Level:</span>{" "}
                            <span className="capitalize">
                              {interaction.interestLevel.replace(/_/g, " ")}
                            </span>
                          </div>
                        )}
                        {interaction.blocker && (
                          <div>
                            <span className="font-medium">Blocker:</span>{" "}
                            <span className="capitalize">
                              {interaction.blocker.replace(/_/g, " ")}
                            </span>
                          </div>
                        )}
                        {interaction.nextAction && (
                          <div>
                            <span className="font-medium">Next Action:</span>{" "}
                            <span className="capitalize">
                              {interaction.nextAction.replace(/_/g, " ")}
                            </span>
                          </div>
                        )}
                        {interaction.notReachedReason && (
                          <div>
                            <span className="font-medium">Not Reached Reason:</span>{" "}
                            <span className="capitalize">
                              {interaction.notReachedReason.replace(/_/g, " ")}
                            </span>
                          </div>
                        )}
                      </div>
                      {interaction.notes && (
                        <div className="mt-3 rounded bg-default-100 p-3">
                          <span className="font-medium">Notes:</span>{" "}
                          {interaction.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
