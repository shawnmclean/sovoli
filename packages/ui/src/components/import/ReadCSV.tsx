import type { NormalizedBooks } from "./hooks/useCSVBooks";
import { useCSVBooks } from "./hooks/useCSVBooks";

export interface ReadCSVProps {
  onBooksParsed: (books: NormalizedBooks[]) => void;
}

export const ReadCSV = ({ onBooksParsed }: ReadCSVProps) => {
  const { getRootProps, getInputProps } = useCSVBooks(onBooksParsed);

  return (
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
  );
};
