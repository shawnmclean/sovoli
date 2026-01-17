"use client";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
} from "@sovoli/ui/components/drawer";
import { XIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";
import { Button } from "@sovoli/ui/components/button";
import type { LeadInteraction } from "../utils/leadCategorization";

interface LeadHistoryModalProps {
    interactions: LeadInteraction[];
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    leadName: string;
}

export function LeadHistoryModal({
    interactions,
    isOpen,
    onOpenChange,
    leadName,
}: LeadHistoryModalProps) {
    // Sort interactions newest first
    const sortedInteractions = [...interactions].sort(
        (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
    );

    return (
        <Drawer
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="md"
            placement="bottom"
            hideCloseButton
            classNames={{
                base: "max-h-[85vh]", // Taller on mobile
            }}
        >
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader
                            title="Interaction History"
                            className="border-b border-default-100"
                            endContent={
                                <Button isIconOnly onPress={onClose} variant="light" size="sm">
                                    <XIcon size={20} className="text-default-500" />
                                </Button>
                            }
                        >
                            <div className="flex flex-col gap-1">
                                <span className="text-lg font-bold">Interaction Log</span>
                                <p className="text-sm font-normal text-default-500">
                                    History for <span className="font-medium text-foreground">{leadName}</span>
                                </p>
                            </div>
                        </DrawerHeader>
                        <DrawerBody className="pb-8 pt-6">
                            <div className="space-y-8 relative pl-2">
                                {/* Timeline vertical line */}
                                <div className="absolute left-[27px] top-3 bottom-6 w-[2px] bg-default-200" />

                                {sortedInteractions.map((interaction, index) => {
                                    const date = new Date(interaction.loggedAt);
                                    const isLatest = index === 0;

                                    // Determine Icon and Color
                                    let icon = <MessageCircleIcon size={14} />;
                                    let colorClass = "bg-primary text-primary-foreground";

                                    if (interaction.contactOutcome === "not_reached") {
                                        icon = <XIcon size={14} />;
                                        colorClass = "bg-default-200 text-default-500";
                                    } else if (interaction.contactOutcome === "conversation") {
                                        icon = <PhoneIcon size={14} />;
                                        colorClass = "bg-success text-success-foreground";
                                    }

                                    return (
                                        <div key={index} className="relative pl-12">
                                            {/* Timeline Node */}
                                            <div
                                                className={`absolute left-3 top-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm z-10 border-2 border-background ${isLatest ? colorClass : "bg-default-100 text-default-400"
                                                    }`}
                                            >
                                                {icon}
                                            </div>

                                            <div className="flex flex-col gap-1.5 -mt-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <span
                                                            className={`text-sm font-bold block ${isLatest ? "text-foreground" : "text-default-600"
                                                                }`}
                                                        >
                                                            {interaction.contactOutcome === "not_reached" ? "Did not reach" :
                                                                interaction.contactOutcome === "conversation" ? "Conversation" : "Brief Contact"}
                                                        </span>
                                                        <span className="text-xs text-default-400 font-mono">
                                                            {date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                                            {" • "}
                                                            {date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>

                                                {(interaction.interestLevel ?? interaction.nextAction) && (
                                                    <div className="flex gap-2 flex-wrap">
                                                        {interaction.interestLevel && (
                                                            <span className="text-[10px] bg-default-100 px-2 py-0.5 rounded-full font-medium text-default-600 border border-default-200 uppercase tracking-wide">
                                                                {interaction.interestLevel.replace(/_/g, " ")}
                                                            </span>
                                                        )}
                                                        {interaction.nextAction && (
                                                            <span className="text-[10px] bg-primary-50 px-2 py-0.5 rounded-full font-medium text-primary-600 border border-primary-100 uppercase tracking-wide">
                                                                {interaction.nextAction.replace(/_/g, " ")}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                <div className={`text-sm p-3 rounded-lg ${isLatest ? "bg-default-50 text-foreground" : "bg-transparent text-default-500 pl-0 pt-1"
                                                    }`}>
                                                    {interaction.notes ??
                                                        (interaction.blocker
                                                            ? `Blocker: ${interaction.blocker.replace(/_/g, " ")}`
                                                            : interaction.notReachedReason
                                                                ? `Reason: ${interaction.notReachedReason.replace(/_/g, " ")}`
                                                                : <span className="italic opacity-70">No notes recorded</span>)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </DrawerBody>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
