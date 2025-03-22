import { useCallback, useRef, useState } from "react";

import type { UploadedAsset } from "../lib/uploadToCloudinary";
import type { UploadSignature } from "~/modules/mediaAssets/lib/generateUploadSignatures";
import { processImage } from "~/core/image/processImage";
import { uploadToCloudinary } from "../lib/uploadToCloudinary";

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
        // Log original file size
        console.log(
          `Original file size: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
        );

        // Process the image before uploading
        const processedBlob = await processImage(
          file,
          80, // quality
          "auto",
          "auto",
          "webp",
        );

        // Log processed file size and compression ratio
        const processedSize = processedBlob.size;
        const compressionRatio = (
          ((file.size - processedSize) / file.size) *
          100
        ).toFixed(1);
        console.log(
          `Processed file size: ${(processedSize / 1024 / 1024).toFixed(2)} MB`,
        );
        console.log(`Compression reduced file size by ${compressionRatio}%`);

        // Convert Blob to File
        const processedFile = new File([processedBlob], file.name, {
          type: processedBlob.type,
        });

        const signature = await getValidSignature();
        const uploadedAsset = await uploadToCloudinary(
          processedFile,
          signature,
        );

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
