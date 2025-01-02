import { useCallback, useState } from "react";

interface UploadResponse {
  signedUrl: string;
  id: string;
  path: string;
}

export interface UseAssetFileUploadProps {
  onFileUploaded: (file: File, id: string, path: string) => void;
}

export const useAssetFileUpload = ({
  onFileUploaded,
}: UseAssetFileUploadProps) => {
  const [files, setFiles] = useState<FileState[]>([]);

  const uploadFile = useCallback(
    async (fileState: FileState) => {
      const { file } = fileState;
      setFiles((current) =>
        current.map((f) =>
          f.file === file ? { ...f, status: "uploading" } : f,
        ),
      );

      try {
        const signedUrlResponse = await fetch("/api/assets", {
          method: "POST",
          body: JSON.stringify({ fileName: file.name, type: file.type }),
        });
        const { signedUrl, id, path } =
          (await signedUrlResponse.json()) as UploadResponse;

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
          current.map((f) =>
            f.file === file ? { ...f, status: "success" } : f,
          ),
        );

        onFileUploaded(file, id, path);
      } catch (error) {
        console.error("Error uploading file:", error);
        setFiles((current) =>
          current.map((f) => (f.file === file ? { ...f, status: "error" } : f)),
        );
      }
    },
    [onFileUploaded],
  );

  const addFiles = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        status: "idle" as FileStatus,
      }));
      setFiles((current) => [...current, ...newFiles]);

      for (const file of newFiles) {
        void uploadFile(file);
      }
    },
    [uploadFile],
  );

  const removeFile = useCallback((file: File) => {
    setFiles((current) => current.filter((f) => f.file !== file));
  }, []);

  return { files, addFiles, removeFile };
};

// FileState and FileStatus types
export type FileStatus = "idle" | "uploading" | "success" | "error";
export interface FileState {
  file: File;
  preview: string;
  status: FileStatus;
}
