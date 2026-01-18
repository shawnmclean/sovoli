"use client";

import dynamic from "next/dynamic";
import { Card } from "@sovoli/ui/components/card";

// Dynamically import ReviewPageClient with SSR disabled to avoid hydration mismatches
const ReviewPageClient = dynamic(
	() => import("./ReviewPageClient").then((mod) => ({ default: mod.ReviewPageClient })),
	{
		ssr: false,
		loading: () => (
			<div className="container mx-auto py-8 px-4">
				<div className="max-w-6xl mx-auto space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold mb-2">Review Import</h1>
							<p className="text-muted-foreground">Loading...</p>
						</div>
					</div>
					<Card className="p-6">
						<div className="animate-pulse space-y-4">
							<div className="h-4 bg-muted rounded w-3/4"></div>
							<div className="h-4 bg-muted rounded w-1/2"></div>
							<div className="h-10 bg-muted rounded"></div>
						</div>
					</Card>
				</div>
			</div>
		),
	}
);

interface ReviewPageClientWrapperProps {
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

export function ReviewPageClientWrapper(props: ReviewPageClientWrapperProps) {
	return <ReviewPageClient {...props} />;
}
