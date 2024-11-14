import { CloudUpload } from "lucide-react";
import { useDropzone } from "react-dropzone";

export interface CSVFileInputProps {
  name: string;
  onFileDropped: (file: File) => void;
}

export const CSVFileInput = ({ name, onFileDropped }: CSVFileInputProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false, // Only allow one file at a time
    accept: { "text/csv": [".csv"] }, // Only accept CSV files
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        onFileDropped(acceptedFiles[0]); // Call the parent callback with the first file
      }
    },
  });

  return (
    <div
      {...getRootProps({
        className:
          "flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600",
      })}
    >
      <input
        {...getInputProps()}
        title="upload file"
        name={name}
        id={name}
        className="sr-only"
      />
      <div className="flex flex-col items-center justify-center">
        <CloudUpload className="mb-5 h-12 w-12 text-gray-600 dark:text-gray-300" />
        <p className="mb-2 text-lg text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          CSV file from Goodreads or Storygraph exports
        </p>
      </div>
    </div>
  );
};
