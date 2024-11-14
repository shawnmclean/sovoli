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
        className: "border-2 border-dashed rounded-xl p-6 text-center",
      })}
    >
      <input {...getInputProps()} name={name} id={name} className="sr-only" />
      <div className="flex flex-col items-center justify-center">
        <CloudUpload className="mb-5 h-12 w-12 text-gray-600 dark:text-gray-300" />
        <p className="mb-2 text-gray-600 dark:text-gray-300">
          Drag and drop your file here, or click to select file
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Goodreads or Storygraph exports
        </p>
      </div>
    </div>
  );
};
