import type { Lead } from "../../../../components/LeadsTable";

export interface LeadInteraction {
    contactOutcome: "not_reached" | "brief_contact" | "conversation";
    notReachedReason?: "try_again_later" | "invalid_number";
    interestLevel?: "not_interested" | "curious" | "unsure" | "wants_to_proceed";
    blocker?:
    | "different_program"
    | "timing"
    | "needs_time"
    | "needs_approval"
    | "needs_visit"
    | "price_uncertainty"
    | "comparing"
    | "not_serious";
    nextAction?:
    | "follow_up_later"
    | "visit_scheduled"
    | "waiting_on_them"
    | "no_followup";
    notes?: string;
    loggedAt: string;
}

export type SystemState = {
    emoji: "🟢" | "🟡" | "⚪" | "🔴";
    label: string;
    category: "strong" | "uncertain" | "lowIntent" | "noVisibility";
};

export function categorizeLead(
    lead: Lead,
    interactions: LeadInteraction[]
): SystemState {
    // Sort interactions by date (newest first)
    const sortedInteractions = [...interactions].sort(
        (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
    );

    const latestInteraction = sortedInteractions[0];

    // No interactions = No Visibility
    if (!latestInteraction) {
        return {
            emoji: "🔴",
            label: "No visibility",
            category: "noVisibility",
        };
    }

    // Not Reached
    if (latestInteraction.contactOutcome === "not_reached") {
        if (latestInteraction.notReachedReason === "invalid_number") {
            return {
                emoji: "⚪",
                label: "Invalid number",
                category: "lowIntent",
            };
        }
        return {
            emoji: "🟡",
            label: "Pending contact",
            category: "uncertain",
        };
    }

    // Not Interested
    if (latestInteraction.interestLevel === "not_interested") {
        return {
            emoji: "⚪",
            label: "Low intent", // Matches "Low intent" in report for "Not interested"
            category: "lowIntent",
        };
    }

    const noteLower = latestInteraction.notes?.toLowerCase() || "";

    // Strong / Wants to Proceed
    if (latestInteraction.interestLevel === "wants_to_proceed") {
        // Specific label matching based on report data
        if (noteLower.includes("april")) {
            return {
                emoji: "🟢",
                label: "Strong – April intake",
                category: "strong",
            };
        }
        if (noteLower.includes("february")) {
            if (noteLower.includes("deferred") || noteLower.includes("later date")) {
                return {
                    emoji: "🟢",
                    label: "Strong – Deferred to Feb",
                    category: "strong",
                };
            }
            return {
                emoji: "🟢",
                label: "Strong – February intake",
                category: "strong",
            };
        }

        if (latestInteraction.nextAction === "visit_scheduled") {
            return {
                emoji: "🟢",
                label: "Visit scheduled",
                category: "strong",
            };
        }

        return {
            emoji: "🟢",
            label: "Wants to proceed",
            category: "strong",
        };
    }

    // Blocker Analysis for Uncertain/Low Intent
    if (latestInteraction.blocker) {
        switch (latestInteraction.blocker) {
            case "not_serious":
                return {
                    emoji: "⚪",
                    label: "Low intent",
                    category: "lowIntent"
                };
            case "needs_time":
                return {
                    emoji: "🟡",
                    label: "Needs time to decide",
                    category: "uncertain"
                };
            case "price_uncertainty":
                return {
                    emoji: "🟡",
                    label: "Price-sensitive / Unclear fit", // Matches report specific label
                    category: "uncertain"
                };
            case "needs_visit":
            case "needs_approval":
            case "comparing":
            case "timing":
                return {
                    emoji: "🟡",
                    label: latestInteraction.blocker.replace(/_/g, " "),
                    category: "uncertain"
                };
            case "different_program":
                return {
                    emoji: "⚪",
                    label: "Wrong program",
                    category: "lowIntent"
                };
        }
    }

    // Default fallback based on interest level if no specific blocker
    if (latestInteraction.interestLevel === "curious" || latestInteraction.interestLevel === "unsure") {
        return {
            emoji: "🟡",
            label: "Uncertain",
            category: "uncertain"
        };
    }

    // Fallback
    return {
        emoji: "🟡",
        label: "In progress",
        category: "uncertain",
    };
}
