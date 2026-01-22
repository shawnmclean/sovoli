"use client";

import { Card } from "@sovoli/ui/components/card";

interface ReviewSummaryProps {
  orgType: "new" | "update";
  orgName: string;
  programsCount: number;
  programsNew: number;
  programsUpdated: number;
}

export function ReviewSummary({
  orgType,
  orgName,
  programsCount,
  programsNew,
  programsUpdated,
}: ReviewSummaryProps) {
  return (
    <Card className="p-6 bg-muted/50">
      <h3 className="text-lg font-semibold mb-4">Review Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Organization:</span>
          <span className="font-medium">{orgName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Action:</span>
          <span className="font-medium">
            {orgType === "new" ? "Create New" : "Update Existing"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Programs:</span>
          <span className="font-medium">{programsCount} total</span>
        </div>
        {programsNew > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">New Programs:</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {programsNew}
            </span>
          </div>
        )}
        {programsUpdated > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Updated Programs:</span>
            <span className="font-medium text-yellow-600 dark:text-yellow-400">
              {programsUpdated}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
