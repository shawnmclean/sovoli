import { Button } from "@sovoli/ui/components/button";
import { Card } from "@sovoli/ui/components/card";
import Link from "next/link";
import {
  getExtractionMetadata,
  listExtractionFiles,
} from "./utils/extraction-loader";

export default function ImportsPage() {
  const extractionIds = listExtractionFiles();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Import Extractions</h1>
          <p className="text-muted-foreground">
            Review and import organization and program data from extraction
            files
          </p>
        </div>

        {extractionIds.length === 0 ? (
          <Card className="p-6">
            <p className="text-muted-foreground">
              No extraction files found. Extraction files should be placed in{" "}
              <code className="text-sm bg-muted px-1 py-0.5 rounded">
                data/leads/extractions/
              </code>
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {extractionIds.map((extractionId) => {
              const metadata = getExtractionMetadata(extractionId);
              return (
                <Card key={extractionId} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">
                          {extractionId}
                        </h3>
                        {metadata?.isApplied && (
                          <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Applied
                          </span>
                        )}
                      </div>
                      {metadata && (
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>
                            File: <code>{metadata.filename}</code>
                          </p>
                          <p>
                            Modified:{" "}
                            {new Date(metadata.modifiedAt).toLocaleString()}
                          </p>
                          {metadata.isApplied && metadata.appliedAt && (
                            <p>
                              Applied:{" "}
                              {new Date(metadata.appliedAt).toLocaleString()}
                            </p>
                          )}
                          <p>Size: {(metadata.size / 1024).toFixed(2)} KB</p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <Link href={`/admin/imports/${extractionId}`}>
                        <Button variant="solid" color="primary">
                          Review
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
