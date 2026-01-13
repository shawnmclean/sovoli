import { notFound } from "next/navigation";
import { loadExtraction } from "../utils/extraction-loader";
import {
  transformExtractionToOrgData,
  transformExtractionToProgramData,
} from "../utils/transform-extraction";
import { matchOrg } from "../utils/org-matcher";
import { matchProgram, loadAllPrograms } from "../utils/program-matcher";
import { ReviewPageClientWrapper } from "./components/ReviewPageClientWrapper";

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
    extraction.business.length > 0
      ? (extraction.business[0] ?? "Unknown Business")
      : "Unknown Business";

  // Match to existing org
  const matchedOrg = matchOrg(extraction.matchedOrgs);
  const isNewOrg = !matchedOrg;

  // Load all existing programs from the organization (if updating)
  const allExistingPrograms = matchedOrg
    ? loadAllPrograms(matchedOrg.orgDir)
    : [];

  // Prepare program data
  const programsData = extraction.extraction.programs.map((program) => {
    const transformed = transformExtractionToProgramData(program);
    const matched = matchProgram(
      matchedOrg?.orgDir ?? "",
      program.matchedPrograms,
    );

    return {
      programId: program.id,
      programName: program.name,
      transformedData: transformed,
      oldProgram: matched?.programData ?? null,
      oldProgramId: matched?.programId ?? null,
      matchedPrograms: program.matchedPrograms ?? null,
      // Pass original extraction data for cycle creation
      schedule: program.schedule ?? null,
      pricing: program.pricing ?? null,
    };
  });

  return (
    <ReviewPageClientWrapper
      extractionId={extractionId}
      businessName={businessName}
      isNewOrg={isNewOrg}
      matchedOrg={matchedOrg}
      transformedOrgData={transformedOrgData}
      oldOrgData={matchedOrg?.orgData ?? null}
      programsData={programsData}
      allExistingPrograms={allExistingPrograms}
    />
  );
}
