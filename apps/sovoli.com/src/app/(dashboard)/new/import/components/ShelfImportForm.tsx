"use client";

import type { KnowledgeType } from "@sovoli/db/schema";
import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@sovoli/ui/components/ui/alert";
import { Button } from "@sovoli/ui/components/ui/button";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@sovoli/ui/components/ui/card";
import { Divider } from "@sovoli/ui/components/ui/divider";
import { Select, SelectItem } from "@sovoli/ui/components/ui/select";
import { Spinner } from "@sovoli/ui/components/ui/spinner";
import { SheetIcon } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";

import type { State } from "../actions/importShelfAction";
import type { GroupedCSVBooks } from "../lib/groupCSVBooksByShelves";
import { importShelfAction } from "../actions/importShelfAction";
import { groupCSVBooksByShelves } from "../lib/groupCSVBooksByShelves";
import { parseCSVIntoBooks } from "../lib/parseCSVIntoBooks";
import { CSVFileInput } from "./CSVFileInput";

export interface ShelfImportFormProps {
  userCollections: {
    id: string;
    title: string;
    type: KnowledgeType;
    itemCount: number;
  }[];
}

export const ShelfImportForm = ({ userCollections }: ShelfImportFormProps) => {
  const [state, formAction] = useFormState<State, FormData>(
    importShelfAction,
    null,
  );
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
        <form action={formAction} method="post">
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
          <CardFooter className="justify-between">
            {currentStep === "file" ? (
              <>
                TODO: instructions for exporting data from Goodreads and
                Storygraph
              </>
            ) : (
              <>
                <Button onClick={handleBackToFileStep} variant="light">
                  Back to File Step
                </Button>
                <SubmitButton />
              </>
            )}
          </CardFooter>
        </form>
      </Card>
      {state && (
        <Alert>
          <AlertTitle>{state.status}</AlertTitle>
          <AlertDescription>
            <p>{state.message}</p>
            <ul>
              {Object.entries(state.errors ?? {}).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}</strong>: {value}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </section>
  );
};

interface SelectFileStepProps {
  onValidFileSelected: (shelves: GroupedCSVBooks[]) => void;
}
const SelectFileStep = ({ onValidFileSelected }: SelectFileStepProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const handleFileDropped = (file: File) => {
    setLoading(true);
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
    setLoading(false);
  };
  return (
    <section className="flex flex-col items-center justify-center gap-4 p-4">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <CSVFileInput name="csvFile" onFileDropped={handleFileDropped} />{" "}
          {error && (
            <Alert variant="danger">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </>
      )}
    </section>
  );
};

interface ShelfMappingStepProps {
  shelves: GroupedCSVBooks[];
  userCollections: {
    id: string;
    title: string;
    type: KnowledgeType;
    itemCount: number;
  }[];
}
const ShelfMappingStep = ({
  shelves,
  userCollections,
}: ShelfMappingStepProps) => {
  function getDefaultShelfMapping(shelf: string) {
    if (shelf === "") return "do-not-import";
    const userCollection = userCollections.find(
      (collection) => collection.title === shelf,
    );
    if (userCollection) {
      return userCollection.id;
    }
    return "new-shelf";
  }

  return (
    <table className="table-auto border-collapse">
      <thead>
        <tr>
          <th className="px-4 py-2">Shelf in File</th>
          <th className="px-4 py-2"></th>
          <th className="px-4 py-2">Your existing shelves</th>
        </tr>
      </thead>
      <tbody>
        {shelves.map((shelf, index) => (
          <tr key={index} className="">
            {/* Shelf Name (Left Column) */}
            <td className="flex flex-row gap-2 px-4 py-2">
              <SheetIcon className="text-green-600 dark:text-green-300" />{" "}
              {shelf.name} ({shelf.books.length})
            </td>

            {/* Arrow Column (Middle) */}
            <td className="px-4 py-2 text-center">→</td>

            {/* Dropdown Column (Right) */}
            <td className="px-4 py-2">
              <input
                type="hidden"
                name={`mapping[${index}][from]`}
                value={shelf.name}
              />
              <Select
                aria-label="Select a shelf to map to"
                name={`mapping[${index}][to]`}
                defaultSelectedKeys={[getDefaultShelfMapping(shelf.name)]}
              >
                <SelectItem key="new-shelf" textValue="New Shelf">
                  New Shelf
                </SelectItem>
                <SelectItem key="do-not-import" textValue="Do Not Import">
                  Do Not Import
                </SelectItem>
                <>
                  {userCollections.map((collection) => (
                    <SelectItem key={collection.id}>
                      {`${collection.title} (${collection.itemCount})`}
                    </SelectItem>
                  ))}
                </>
              </Select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" color="primary" isLoading={pending}>
      Import
    </Button>
  );
}
