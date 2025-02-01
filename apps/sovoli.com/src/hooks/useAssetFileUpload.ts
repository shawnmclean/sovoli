import { useCallback, useState } from "react";

export interface UploadedAsset {
  id: string;
}

interface UploadResponse extends UploadedAsset {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}

export interface UseAssetFileUploadProps {
  onFileUploaded: (asset: UploadedAsset) => void;
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
        const signedUrlResponseBody =
          (await signedUrlResponse.json()) as UploadResponse;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signedUrlResponseBody.apiKey);
        formData.append(
          "timestamp",
          signedUrlResponseBody.timestamp.toString(),
        );
        formData.append("signature", signedUrlResponseBody.signature);
        formData.append("public_id", signedUrlResponseBody.id);
        formData.append("folder", signedUrlResponseBody.folder);

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${signedUrlResponseBody.cloudName}/auto/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file");
        }

        setFiles((current) =>
          current.map((f) =>
            f.file === file
              ? {
                  ...f,
                  status: "success",
                  uploadedAsset: signedUrlResponseBody,
                }
              : f,
          ),
        );

        onFileUploaded(signedUrlResponseBody);
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
  uploadedAsset?: UploadedAsset;
}
