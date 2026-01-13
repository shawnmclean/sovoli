import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@sovoli/ui/components/button";
import { Card } from "@sovoli/ui/components/card";
import { loadExtraction } from "../utils/extraction-loader";
import { transformExtractionToOrgData, transformExtractionToProgramData } from "../utils/transform-extraction";
import { matchOrg } from "../utils/org-matcher";
import { matchProgram, loadAllPrograms } from "../utils/program-matcher";
import { ReviewPageClient } from "./components/ReviewPageClient";

interface PageProps {
	params: Promise<{ extractionId: string }>;
}

export default async function ReviewPage({ params }: PageProps) {
	const { extractionId } = await params;

	// Load extraction data
	const extraction = loadExtraction(extractionId);
	if (!extraction) {
		notFound();
	}

	// Transform extraction data
	const transformedOrgData = transformExtractionToOrgData(extraction);
	const businessName =
		extraction.business && extraction.business.length > 0
			? extraction.business[0]!
			: "Unknown Business";

	// Match to existing org
	const matchedOrg = matchOrg(extraction.matchedOrgs);
	const isNewOrg = !matchedOrg;

	// Load all existing programs from the organization (if updating)
	const allExistingPrograms = matchedOrg ? loadAllPrograms(matchedOrg.orgDir) : [];

	// Prepare program data
	const programsData = extraction.extraction.programs.map((program) => {
		const transformed = transformExtractionToProgramData(program);
		const matched = matchProgram(
			matchedOrg?.orgDir || "",
			program.matchedPrograms,
		);

		return {
			programId: program.id,
			programName: program.name,
			transformedData: transformed,
			oldProgram: matched?.programData || null,
			oldProgramId: matched?.programId || null,
			matchedPrograms: program.matchedPrograms ?? null,
		};
	});

	return (
		<ReviewPageClient
			extractionId={extractionId}
			businessName={businessName}
			isNewOrg={isNewOrg}
			matchedOrg={matchedOrg}
			transformedOrgData={transformedOrgData}
			oldOrgData={matchedOrg?.orgData || null}
			programsData={programsData}
			allExistingPrograms={allExistingPrograms}
		/>
	);
}
