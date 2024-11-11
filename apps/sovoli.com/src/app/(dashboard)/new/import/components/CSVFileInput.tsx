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
          "dropzone border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:bg-gray-100 transition-colors dark:border-gray-600 dark:hover:bg-gray-700",
      })}
    >
      <input {...getInputProps()} name={name} id={name} />
      <p className="text-gray-600 dark:text-gray-300">
        Drag 'n' drop some files here, or click to select files
      </p>
    </div>
  );
};
