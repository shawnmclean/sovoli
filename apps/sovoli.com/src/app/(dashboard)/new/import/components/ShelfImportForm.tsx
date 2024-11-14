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
          {currentStep === "file" && (
            <>
              <CardHeader>
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-bold">
                    Upload your Goodreads or Storygraph data
                  </h1>
                  <p className="text-default-500">
                    Upload or drag and drop the file below
                  </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <SelectFileStep onValidFileSelected={handleValidFileSelected} />
              </CardBody>
              <Divider />
              <CardFooter>Upload stuff</CardFooter>
            </>
          )}

          {currentStep === "mapping" && (
            <>
              <CardHeader>
                <div className="flex flex-col">
                  <p className="text-md">NextUI</p>
                  <p className="text-small text-default-500">nextui.org</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <ShelfMappingStep
                  shelves={shelves}
                  userCollections={userCollections}
                />
              </CardBody>
              <Divider />
              <CardFooter>
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
              </CardFooter>
            </>
          )}
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
  const [mapping, setMapping] = useState<
    { from: string; to: { id?: string; name?: string }; isEnabled: boolean }[]
  >([]);
  const handleAddCheckboxChange = (index: number) => {
    const updatedMapping = [...mapping];
    if (updatedMapping[index]) {
      updatedMapping[index].isEnabled = !updatedMapping[index].isEnabled;
      setMapping(updatedMapping);
    }
  };

  const handleDropdownChange = (index: number, value: string) => {
    const updatedMapping = [...mapping];
    if (updatedMapping[index]) {
      updatedMapping[index].to = userCollections.find(
        (collection) => collection.id === value,
      )
        ? { id: value, name: undefined }
        : { id: undefined, name: "new-shelf" };
      setMapping(updatedMapping);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Map books to shelves</h1>
      {shelves.map((shelf, index) => (
        <ShelfItem
          key={shelf.name}
          name={shelf.name}
          booksCount={shelf.books.length}
          userCollections={userCollections}
          isAddEnabled={mapping[index]?.isEnabled ?? false}
          onAddCheckboxChange={() => handleAddCheckboxChange(index)}
          selectedValue={mapping[index]?.to.id ?? "new-shelf"}
          onDropdownChange={(value) => handleDropdownChange(index, value)}
        />
      ))}

      {/* Structured Hidden Inputs */}
      {mapping.map(
        (map, index) =>
          map.isEnabled && (
            <div key={index}>
              <input
                type="hidden"
                name={`mapping[${index}][from]`}
                value={map.from}
              />
              {map.to.id && (
                <input
                  type="hidden"
                  name={`mapping[${index}][to][id]`}
                  value={map.to.id}
                />
              )}
              {map.to.name && (
                <input
                  type="hidden"
                  name={`mapping[${index}][to][name]`}
                  value={map.to.name}
                />
              )}
            </div>
          ),
      )}
    </section>
  );
};

const ShelfItem = ({
  name,
  booksCount,
  userCollections,
  isAddEnabled,
  onAddCheckboxChange,
  selectedValue,
  onDropdownChange,
}: {
  name: string;
  booksCount: number;
  userCollections: {
    id: string;
    title?: string | null;
    type: KnowledgeType;
    itemCount: number;
  }[];
  isAddEnabled: boolean;
  onAddCheckboxChange: () => void;
  selectedValue: string;
  onDropdownChange: (value: string) => void;
}) => {
  return (
    <div className="rounded-lg p-4 shadow-md dark:bg-gray-700">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {name} ({booksCount})
        </h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={isAddEnabled}
            onChange={onAddCheckboxChange}
          />
          <span className="text-gray-700 dark:text-gray-300">Add</span>
        </label>
      </div>

      <select
        className={`mt-2 w-full rounded border p-2 ${
          !isAddEnabled ? "opacity-50" : ""
        }`}
        name="collection"
        value={selectedValue}
        onChange={(e) => onDropdownChange(e.target.value)}
        disabled={!isAddEnabled}
      >
        <option value="new-shelf">New Shelf</option>
        {userCollections.map((collection) => (
          <option key={collection.id} value={collection.id}>
            {collection.title} ({collection.itemCount})
          </option>
        ))}
      </select>

      {selectedValue === "new-shelf" && isAddEnabled && (
        <div className="mt-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" />
            <span className="text-gray-700 dark:text-gray-300">Shelf</span>
          </label>
        </div>
      )}
    </div>
  );
};
