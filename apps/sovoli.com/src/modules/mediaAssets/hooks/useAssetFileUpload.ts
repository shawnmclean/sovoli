import { useCallback, useRef, useState } from "react";

import type { UploadSignature } from "~/modules/mediaAssets/lib/generateUploadSignatures";

// Type Definitions
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

export type FileStatus = "idle" | "uploading" | "success" | "error";

export interface FileState {
  file: File;
  preview: string;
  status: FileStatus;
  uploadedAsset?: UploadedAsset;
}

// Hook Implementation
export const useAssetFileUpload = ({
  onFileUploaded,
  uploadSignatures: initialUploadSignatures = [],
}: UseAssetFileUploadProps) => {
  // State for UI updates
  const [files, setFiles] = useState<FileState[]>([]);

  // Ref to store signature queue and avoid unnecessary re-renders
  const signatureQueue = useRef<UploadSignature[]>(initialUploadSignatures);
  const isFetchingSignatures = useRef(false);
  const fetchSignaturesPromise = useRef<Promise<void> | null>(null);

  /**
   * Fetches new upload signatures and updates the queue.
   */
  const fetchNewSignatures = useCallback(async () => {
    if (isFetchingSignatures.current || fetchSignaturesPromise.current) {
      return fetchSignaturesPromise.current;
    }

    isFetchingSignatures.current = true;
    fetchSignaturesPromise.current = (async () => {
      try {
        const response = await fetch("/api/upload/signatures");
        if (!response.ok) throw new Error("Failed to get upload signatures");

        const newSignatures = (await response.json()) as UploadSignature[];
        signatureQueue.current = newSignatures;
      } catch (error) {
        console.error("Error fetching upload signatures:", error);
      } finally {
        isFetchingSignatures.current = false;
        fetchSignaturesPromise.current = null;
      }
    })();

    return fetchSignaturesPromise.current;
  }, []);

  /**
   * Retrieves a valid signature, fetching new ones if needed.
   */
  const getValidSignature = useCallback(async (): Promise<UploadSignature> => {
    while (true) {
      const signature = signatureQueue.current.pop();

      if (signature) {
        const expirationTime = signature.timestamp + 3600; // 1-hour validity
        const now = Math.round(Date.now() / 1000);

        if (now < expirationTime) return signature;
      }

      await fetchNewSignatures();
    }
  }, [fetchNewSignatures]);

  /**
   * Uploads a file to Cloudinary.
   */
  const uploadFile = useCallback(
    async (fileState: FileState) => {
      const { file } = fileState;
      updateFileStatus(file, "uploading");

      try {
        const signature = await getValidSignature();
        const uploadedAsset = await uploadToCloudinary(file, signature);

        updateFileStatus(file, "success", uploadedAsset);
        onFileUploaded(uploadedAsset);
      } catch (error) {
        console.error("Error uploading file:", error);
        updateFileStatus(file, "error");
      }
    },
    [getValidSignature, onFileUploaded],
  );

  /**
   * Adds files to be uploaded.
   */
  const addFiles = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map(createFileState);
      setFiles((current) => [...current, ...newFiles]);

      newFiles.forEach((fileState) => void uploadFile(fileState));
    },
    [uploadFile],
  );

  /**
   * Removes a file from the list.
   */
  const removeFile = useCallback((file: File) => {
    setFiles((current) => current.filter((f) => f.file !== file));
  }, []);

  /**
   * Updates the status of a file.
   */
  const updateFileStatus = (
    file: File,
    status: FileStatus,
    uploadedAsset?: UploadedAsset,
  ) => {
    setFiles((current) =>
      current.map((f) =>
        f.file === file ? { ...f, status, uploadedAsset } : f,
      ),
    );
  };

  return { files, addFiles, removeFile };
};

/**
 * Creates a FileState object for a new file.
 */
const createFileState = (file: File): FileState => ({
  file,
  preview: URL.createObjectURL(file),
  status: "idle",
});

/**
 * Uploads a file to Cloudinary with the given signature.
 */
const uploadToCloudinary = async (
  file: File,
  signature: UploadSignature,
): Promise<UploadedAsset> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", signature.timestamp.toString());
  formData.append("signature", signature.signature);
  formData.append("public_id", signature.id);
  formData.append("folder", signature.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`,
    { method: "POST", body: formData },
  );

  if (!response.ok) throw new Error("Failed to upload file");

  const uploadResponse = (await response.json()) as CloudinaryUploadResponse;
  return { id: signature.id, url: uploadResponse.url };
};
