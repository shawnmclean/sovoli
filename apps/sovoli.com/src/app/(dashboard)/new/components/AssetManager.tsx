import { useCallback, useState } from "react";
import { ne } from "@sovoli/db";
import { CloudUpload } from "lucide-react";
import { FileRejection, useDropzone } from "react-dropzone";

export interface AssetManagerProps {
  onFileUploaded: (file: File, id: string, path: string) => void;
}

type FileStatus = "idle" | "uploading" | "success" | "error";
interface FileState {
  file: File;
  preview: string;
  status: FileStatus;
}

export const AssetManager = ({ onFileUploaded }: AssetManagerProps) => {
  const [files, setFiles] = useState<FileState[]>([]);
  const [fileRejections, setFileRejections] = useState<FileRejection[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: "idle" as FileStatus,
    }));
    setFiles((current) => [...current, ...newFiles]);

    for (const file of newFiles) {
      void uploadFile(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    onDrop: (acceptedFiles, fileRejections) => {
      onDrop(acceptedFiles);
      setFileRejections(fileRejections);
    },
  });

  const uploadFile = async (fileState: FileState) => {
    const { file } = fileState;
    setFiles((current) =>
      current.map((f) => (f.file === file ? { ...f, status: "uploading" } : f)),
    );

    try {
      const signedUrlResponse = await fetch("/api/assets", {
        method: "POST",
        body: JSON.stringify({ fileName: file.name, type: file.type }),
      });
      const { signedUrl, id, path } = (await signedUrlResponse.json()) as {
        signedUrl: string;
        id: string;
        path: string;
      };

      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      setFiles((current) =>
        current.map((f) => (f.file === file ? { ...f, status: "success" } : f)),
      );

      onFileUploaded(file, id, path);
    } catch (error) {
      console.error("Error uploading file:", error);
      setFiles((current) =>
        current.map((f) => (f.file === file ? { ...f, status: "error" } : f)),
      );
    }
  };

  const handleRemoveFile = (file: File) => {
    setFiles((current) => current.filter((f) => f.file !== file));
  };

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
                onClick={() => handleRemoveFile(file.file)}
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
