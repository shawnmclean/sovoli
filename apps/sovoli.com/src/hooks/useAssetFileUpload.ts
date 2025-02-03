import { useCallback, useState } from "react";

import type { UploadSignature } from "~/app/(dashboard)/new/lib/generateUploadSignatures";

export interface UploadedAsset {
  id: string;
  url: string;
}

interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  url: string;
}

export interface UseAssetFileUploadProps {
  onFileUploaded: (asset: UploadedAsset) => void;
  uploadSignatures?: UploadSignature[];
}

export const useAssetFileUpload = ({
  onFileUploaded,
  uploadSignatures,
}: UseAssetFileUploadProps) => {
  console.log(uploadSignatures);
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
        let signature = uploadSignatures?.pop();

        if (!signature) {
          // get it from action or API?
          signature = {
            apiKey: "",
            cloudName: "",
            folder: "",
            id: "",
            signature: "",
            timestamp: 12,
          };
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signature.apiKey);
        formData.append("timestamp", signature.timestamp.toString());
        formData.append("signature", signature.signature);
        formData.append("public_id", signature.id);
        formData.append("folder", signature.folder);

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file");
        }

        const uploadResponseBody =
          (await uploadResponse.json()) as CloudinaryUploadResponse;

        const uploadedAsset: UploadedAsset = {
          id: signature.id,
          url: uploadResponseBody.url,
        };

        setFiles((current) =>
          current.map((f) =>
            f.file === file
              ? {
                  ...f,
                  status: "success",
                  uploadedAsset: uploadedAsset,
                }
              : f,
          ),
        );

        onFileUploaded(uploadedAsset);
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
