"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { CloudUpload, X, Loader2, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@sovoli/ui/components/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";

import { uploadToCloudinary } from "~/core/cloudinary/uploadToCloudinary";
import type { UploadSignature } from "~/core/cloudinary/generateUploadSignatures";
import { processImage } from "~/core/image/processImage";

import type { Media } from "~/modules/core/media/types";

type UploadStatus = "uploading" | "error";

interface UploadQueueItem {
  id: string;
  fileName: string;
  previewUrl: string;
  status: UploadStatus;
  errorMessage?: string;
  file: File;
}

type DisplayItem =
  | {
      kind: "photo";
      key: string;
      fileName: string;
      imageSrc: string;
      alt: string;
      status: "success";
      statusLabel: string;
    }
  | {
      kind: "queue";
      key: string;
      fileName: string;
      imageSrc: string;
      alt: string;
      status: UploadStatus;
      statusLabel: string;
      errorMessage?: string;
    };

const getFirstNonEmpty = (...values: (string | undefined)[]) =>
  values.find((value) => value !== undefined && value.trim().length > 0);

const getPhotoKey = (photo: Media) =>
  getFirstNonEmpty(
    photo.publicId,
    photo.id,
    photo.assetId,
    photo.url,
    photo.caption,
    photo.alt,
  ) ?? crypto.randomUUID();

export interface DamagePhotosUploadProps {
  photos: Media[];
  username: string;
  onPhotosChange: (updater: (photos: Media[]) => Media[]) => void;
  onUploadStatusChange?: (hasPendingUploads: boolean) => void;
}

export function DamagePhotosUpload({
  photos,
  username,
  onPhotosChange,
  onUploadStatusChange,
}: DamagePhotosUploadProps) {
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const queueRef = useRef<UploadQueueItem[]>([]);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    return () => {
      queueRef.current.forEach((item) => {
        if (item.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, []);

  const updateQueueItems = useCallback(
    (ids: string[], updater: (item: UploadQueueItem) => UploadQueueItem) => {
      setQueue((current) =>
        current.map((item) => (ids.includes(item.id) ? updater(item) : item)),
      );
    },
    [],
  );

  const removeQueueItem = useCallback((id: string) => {
    setQueue((current) => {
      const target = current.find((item) => item.id === id);
      const previewUrl = target?.previewUrl;
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      return current.filter((item) => item.id !== id);
    });
  }, []);

  const removePhotoByKey = useCallback(
    (key: string) => {
      onPhotosChange((current) =>
        current.filter((photo) => getPhotoKey(photo) !== key),
      );
    },
    [onPhotosChange],
  );

  const handleRemove = useCallback(
    (key: string, kind: "photo" | "queue") => {
      if (kind === "photo") {
        removePhotoByKey(key);
      } else {
        removeQueueItem(key);
      }
    },
    [removePhotoByKey, removeQueueItem],
  );

  const fetchSignatures = useCallback(
    async (count: number) => {
      const trimmedUsername = username.trim();
      const response = await fetch("/api/needs/upload-signatures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          count,
          username: trimmedUsername.length > 0 ? trimmedUsername : undefined,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || "Unable to request Cloudinary upload signatures.",
        );
      }

      return (await response.json()) as UploadSignature[];
    },
    [username],
  );

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const incomingItems: UploadQueueItem[] = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        fileName: file.name,
        previewUrl: URL.createObjectURL(file),
        status: "uploading",
        file,
      }));

      setQueue((current) => [...current, ...incomingItems]);

      let signatures: UploadSignature[] = [];

      try {
        signatures = await fetchSignatures(acceptedFiles.length);
      } catch (error) {
        console.error("Failed to request Cloudinary upload signatures:", error);
        const message =
          error instanceof Error
            ? error.message
            : "Failed to request upload signatures.";
        updateQueueItems(
          incomingItems.map((item) => item.id),
          (item) => ({
            ...item,
            status: "error",
            errorMessage: message,
          }),
        );
        return;
      }

      await Promise.all(
        incomingItems.map(async (item, index) => {
          const { file } = item;
          const signature = signatures[index];
          if (!signature) {
            updateQueueItems([item.id], (queueItem) => ({
              ...queueItem,
              status: "error",
              errorMessage: "Missing upload data for this file.",
            }));
            return;
          }

          try {
            const processedBlob = await processImage(file);

            const processedFileName = file.name.replace(/\.[^/.]+$/, ".webp");
            const processedFile = new File([processedBlob], processedFileName, {
              type: processedBlob.type,
              lastModified: Date.now(),
            });

            const uploadedAsset = await uploadToCloudinary(
              processedFile,
              signature,
            );

            const uploadedPhoto: Media = {
              type: "image",
              category: "default",
              url: uploadedAsset.url,
              caption: item.fileName,
              alt: item.fileName,
              publicId: uploadedAsset.publicId,
              assetId: uploadedAsset.assetId,
              bytes: uploadedAsset.bytes,
              width: uploadedAsset.width,
              height: uploadedAsset.height,
              format: uploadedAsset.format,
              version: uploadedAsset.version,
              bucket: signature.folder,
              uploadedAt: uploadedAsset.createdAt,
            };

            onPhotosChange((current) => [...current, uploadedPhoto]);
            removeQueueItem(item.id);
          } catch (error) {
            console.error("Cloudinary upload failed:", error);
            const message =
              error instanceof Error
                ? error.message
                : "Cloudinary upload failed.";

            updateQueueItems([item.id], (queueItem) => ({
              ...queueItem,
              status: "error",
              errorMessage: message,
            }));
          }
        }),
      );
    },
    [fetchSignatures, onPhotosChange, removeQueueItem, updateQueueItems],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    onDrop: (acceptedFiles) => {
      void handleDrop(acceptedFiles);
    },
  });

  const displayItems = useMemo<DisplayItem[]>(() => {
    const photoItems: DisplayItem[] = photos.map((photo) => ({
      key: getPhotoKey(photo),
      kind: "photo" as const,
      fileName:
        getFirstNonEmpty(photo.caption, photo.alt, photo.publicId) ??
        "Uploaded photo",
      imageSrc: photo.url,
      alt:
        getFirstNonEmpty(photo.alt, photo.caption, photo.publicId) ??
        "Damage photo",
      status: "success",
      statusLabel: "Uploaded",
    }));

    const queueItems: DisplayItem[] = queue.map((item) => ({
      key: item.id,
      kind: "queue" as const,
      fileName: item.fileName,
      imageSrc: item.previewUrl,
      alt: item.fileName,
      status: item.status,
      errorMessage: item.errorMessage,
      statusLabel: item.status === "uploading" ? "Uploading…" : "Error",
    }));

    return [...photoItems, ...queueItems];
  }, [photos, queue]);

  useEffect(() => {
    onUploadStatusChange?.(queue.length > 0);
  }, [onUploadStatusChange, queue]);

  const totalCount = photos.length + queue.length;

  return (
    <div className="space-y-4">
      <div
        {...getRootProps({
          className: `flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-default-300 hover:border-default-400 hover:bg-default-50 dark:border-default-600 dark:hover:border-default-500 dark:hover:bg-default-900/50"
          }`,
        })}
      >
        <input
          {...getInputProps()}
          title="upload file"
          name="damage-photos"
          id="damage-photos"
          className="sr-only"
        />
        <div className="flex flex-col items-center justify-center">
          <CloudUpload className="mb-3 h-10 w-10 text-default-500" />
          <p className="mb-1 text-sm font-medium text-default-700">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-default-500">
            (JPEG, PNG or WEBP images up to 10MB)
          </p>
        </div>
      </div>

      {displayItems.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-default-700">
            {totalCount} photo{totalCount !== 1 ? "s" : ""} added
          </p>
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {displayItems.map((item) => (
                <CarouselItem
                  key={item.key}
                  className="pl-2 md:pl-4 basis-[160px] shrink-0"
                >
                  <div className="relative group aspect-square overflow-hidden rounded-lg border border-default-200 bg-default-100">
                    <Image
                      src={item.imageSrc}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />

                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="solid"
                      className="absolute top-2 right-2 z-20"
                      onPress={() =>
                        handleRemove(
                          item.key,
                          item.kind === "photo" ? "photo" : "queue",
                        )
                      }
                      aria-label={`Remove ${item.fileName}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    {item.kind === "queue" && item.status === "uploading" && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}

                    {item.kind === "queue" && item.status === "error" && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-danger-500/70 p-3 text-center text-white">
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-xs font-semibold">
                          Upload failed
                        </span>
                        {item.errorMessage && (
                          <span className="text-[10px] leading-tight">
                            {item.errorMessage}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs text-white">
                      <p className="truncate">{item.fileName}</p>
                      <p className="text-[10px] capitalize">
                        {item.statusLabel}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </div>
  );
}
