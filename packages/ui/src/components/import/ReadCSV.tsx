import type { ParsedBooksResult } from "./hooks/useCSVBooks";
import { useCSVBooks } from "./hooks/useCSVBooks";

export interface ReadCSVProps {
  onBooksParsed: (result: ParsedBooksResult) => void;
}

export const ReadCSV = ({ onBooksParsed }: ReadCSVProps) => {
  const { getRootProps, getInputProps, parsedBooks, error } = useCSVBooks({
    onBooksParsed,
  });

  return (
    <>
      <div
        {...getRootProps({
          className:
            "dropzone border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:bg-gray-100 transition-colors dark:border-gray-600 dark:hover:bg-gray-700",
        })}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600 dark:text-gray-300">
          Drag 'n' drop some files here, or click to select files
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 rounded-md bg-red-100 p-4 text-red-600 shadow-md">
          <p className="text-lg font-semibold">Error: {error}</p>
        </div>
      )}

      {/* Dashboard Box for Total Books */}
      <div className="mt-6 flex justify-around rounded-lg bg-gray-100 p-4 shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Total Books
          </h4>
          <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">
            {parsedBooks?.totalBooks ?? 0}
          </p>
        </div>
      </div>
    </>
  );
};
