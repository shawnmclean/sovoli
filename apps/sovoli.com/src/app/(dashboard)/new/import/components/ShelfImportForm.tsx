"use client";

import type { KnowledgeType } from "@sovoli/db/schema";
import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@sovoli/ui/components/ui/alert";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@sovoli/ui/components/ui/card";
import { Divider } from "@sovoli/ui/components/ui/divider";

import type { GroupedCSVBooks } from "../lib/groupCSVBooksByShelves";
import { importShelfAction } from "../actions/importShelfAction";
import { groupCSVBooksByShelves } from "../lib/groupCSVBooksByShelves";
import { parseCSVIntoBooks } from "../lib/parseCSVIntoBooks";
import { CSVFileInput } from "./CSVFileInput";

export interface ShelfImportFormProps {
  userCollections: {
    id: string;
    title?: string | null;
    type: KnowledgeType;
    itemCount: number;
  }[];
}

export const ShelfImportForm = ({ userCollections }: ShelfImportFormProps) => {
  const [shelves, setShelves] = useState<GroupedCSVBooks[]>([]);
  const [currentStep, setCurrentStep] = useState<"file" | "mapping">("file");

  const handleValidFileSelected = (shelves: GroupedCSVBooks[]) => {
    setShelves(shelves);
    setCurrentStep("mapping"); // Once shelves are available, go to mapping step
  };

  const handleBackToFileStep = () => {
    setShelves([]); // Reset shelves data
    setCurrentStep("file"); // Go back to file step
  };

  return (
    <section className="container mx-auto p-4">
      <Card>
        <form action={importShelfAction} method="post">
          <CardHeader>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">
                {currentStep === "file"
                  ? "Upload your Goodreads or Storygraph data"
                  : "Map shelves"}
              </h1>
              <p className="text-default-500">
                {currentStep === "file"
                  ? "Upload or drag and drop the file below"
                  : "Ensure you select shelves to import and map to existing ones"}
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className={currentStep === "file" ? "" : "hidden"}>
              <SelectFileStep onValidFileSelected={handleValidFileSelected} />
            </div>

            {/* Only render the mapping step when the current step is "mapping" */}
            {currentStep === "mapping" && (
              <ShelfMappingStep
                shelves={shelves}
                userCollections={userCollections}
              />
              // <ShelfMappingForm />
            )}
          </CardBody>
          <Divider />
          <CardFooter>
            {currentStep === "file" ? (
              <>
                TODO: instructions for exporting data from Goodreads and
                Storygraph
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleBackToFileStep}
                  className="btn btn-secondary"
                >
                  Back to File Step
                </button>
                <button type="submit" className="btn btn-primary">
                  Import
                </button>
              </>
            )}
          </CardFooter>
        </form>
      </Card>
    </section>
  );
};

interface SelectFileStepProps {
  onValidFileSelected: (shelves: GroupedCSVBooks[]) => void;
}
const SelectFileStep = ({ onValidFileSelected }: SelectFileStepProps) => {
  const [error, setError] = useState<string | null>(null);
  const handleFileDropped = (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvContent = event.target?.result as string;

        try {
          const books = parseCSVIntoBooks(csvContent); // Pass csvContent as a string
          const grouped = groupCSVBooksByShelves(books);
          onValidFileSelected(grouped);
          setError(null);
        } catch {
          setError(
            "Failed to parse the CSV file. Please check the format and try again.",
          );
        }
      };

      reader.onerror = () => {
        setError("Error reading the file. Please try again.");
      };

      reader.readAsText(file);
    } catch {
      setError("Failed to read the file. Please try again.");
    }
  };
  return (
    <section className="flex flex-col items-center justify-center gap-4 p-4">
      <CSVFileInput name="csvFile" onFileDropped={handleFileDropped} />{" "}
      {error && (
        <Alert variant="danger">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </section>
  );
};

interface ShelfMappingStepProps {
  shelves: GroupedCSVBooks[];
  userCollections: {
    id: string;
    title?: string | null;
    type: KnowledgeType;
    itemCount: number;
  }[];
}
const ShelfMappingStep = ({
  shelves,
  userCollections,
}: ShelfMappingStepProps) => {
  return (
    <table className="table-auto border-collapse">
      <thead>
        <tr>
          <th className="px-4 py-2">Shelf in File</th>
          <th className="px-4 py-2"></th>
          <th className="px-4 py-2">Your existing shelves</th>
          <th className="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {shelves.map((shelf, index) => (
          <tr key={index} className="">
            {/* Shelf Name (Left Column) */}
            <td className="px-4 py-2">
              {shelf.name} ({shelf.books.length})
            </td>

            {/* Arrow Column (Middle) */}
            <td className="px-4 py-2 text-center">→</td>

            {/* Dropdown Column (Right) */}
            <td className="px-4 py-2">
              <select className="rounded border px-2 py-1">
                <option value="do-not-import">Do Not Import</option>
                <option value="new-shelf">New Shelf</option>
                {userCollections.map((collection, idx) => (
                  <option key={idx} value={collection.id}>
                    {collection.title} ({collection.itemCount})
                  </option>
                ))}
              </select>
            </td>

            {/* Checkbox Column (Far Right) */}
            <td className="px-4 py-2 text-center">t</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
