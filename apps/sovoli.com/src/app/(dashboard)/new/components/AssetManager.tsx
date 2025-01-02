import type { FileRejection } from "react-dropzone";
import { useCallback, useState } from "react";
import { CloudUpload } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { useAssetFileUpload } from "~/hooks/useAssetFileUpload";

export interface AssetManagerProps {
  onFileUploaded: (file: File, id: string, path: string) => void;
}

export const AssetManager = ({ onFileUploaded }: AssetManagerProps) => {
  const { files, addFiles, removeFile } = useAssetFileUpload({
    onFileUploaded,
  });
  const [fileRejections, setFileRejections] = useState<FileRejection[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      addFiles(acceptedFiles);
      setFileRejections(fileRejections);
    },
    [addFiles],
  );
  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    onDrop,
  });

  return (
    <div>
      <div
        {...getRootProps({
          className:
            "flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600",
        })}
      >
        <input {...getInputProps()} title="upload file" className="sr-only" />
        <div className="flex flex-col items-center justify-center">
          <CloudUpload className="mb-5 h-12 w-12 text-gray-600 dark:text-gray-300" />
          <p className="mb-2 text-lg text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            (Only *.jpeg and *.png images will be accepted)
          </p>
        </div>
      </div>
      {fileRejections.length > 0 && (
        <div className="flex flex-col gap-2">
          {fileRejections.map((fileRejection) => {
            const { file } = fileRejection;
            return (
              <div key={file.name} className="flex flex-col items-center gap-2">
                <div>
                  {fileRejection.errors.map((error) => (
                    <p key={error.code}>{error.message}</p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {files.map((file) => (
          <div
            key={file.file.name}
            className="flex flex-col items-center gap-2"
          >
            <div className="relative h-48 w-48 items-center rounded-lg bg-gray-200">
              <img src={file.preview} alt="Preview" />
              <button
                type="button"
                className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white"
                onClick={() => removeFile(file.file)}
              >
                ✕
              </button>
            </div>
            <div>
              {file.status === "uploading" && <p>Uploading...</p>}
              {file.status === "success" && <p>Uploaded successfully!</p>}
              {file.status === "error" && <p>Upload failed.</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
