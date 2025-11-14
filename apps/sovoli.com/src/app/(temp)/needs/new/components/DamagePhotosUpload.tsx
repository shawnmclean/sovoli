"use client";

import { useCallback } from "react";
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

import type { DamagePhoto } from "./damage-photo-types";
import { createDamagePhoto } from "./damage-photo-types";

export interface DamagePhotosUploadProps {
  photos: DamagePhoto[];
  onPhotosChange: (updater: (photos: DamagePhoto[]) => DamagePhoto[]) => void;
}

export function DamagePhotosUpload({
  photos,
  onPhotosChange,
}: DamagePhotosUploadProps) {
  const assignPhotos = useCallback(
    (newPhotos: DamagePhoto[]) => {
      onPhotosChange((current) => [...current, ...newPhotos]);
    },
    [onPhotosChange],
  );

  const updatePhoto = useCallback(
    (id: string, partial: Partial<DamagePhoto>) => {
      onPhotosChange((current) =>
        current.map((photo) => {
          if (photo.id !== id) return photo;

          if (
            partial.status === "success" &&
            photo.previewUrl.startsWith("blob:")
          ) {
            URL.revokeObjectURL(photo.previewUrl);
          }

          return { ...photo, ...partial };
        }),
      );
    },
    [onPhotosChange],
  );

  const markPhotosAsErrored = useCallback(
    (photosToUpdate: DamagePhoto[], errorMessage: string) => {
      onPhotosChange((current) =>
        current.map((photo) => {
          if (!photosToUpdate.some((target) => target.id === photo.id)) {
            return photo;
          }

          return {
            ...photo,
            status: "error",
            errorMessage,
          };
        }),
      );
    },
    [onPhotosChange],
  );

  const handleRemove = useCallback(
    (photoId: string) => {
      onPhotosChange((current) => {
        const photoToRemove = current.find((photo) => photo.id === photoId);
        if (photoToRemove && photoToRemove.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(photoToRemove.previewUrl);
        }
        return current.filter((photo) => photo.id !== photoId);
      });
    },
    [onPhotosChange],
  );

  const fetchSignatures = useCallback(async (count: number) => {
    const response = await fetch("/api/needs/upload-signatures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count }),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        message || "Unable to request Cloudinary upload signatures.",
      );
    }

    return (await response.json()) as UploadSignature[];
  }, []);

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const incomingPhotos = acceptedFiles.map(createDamagePhoto);
      assignPhotos(incomingPhotos);

      let signatures: UploadSignature[];

      try {
        signatures = await fetchSignatures(acceptedFiles.length);
      } catch (error) {
        console.error("Failed to request Cloudinary upload signatures:", error);
        const message =
          error instanceof Error
            ? error.message
            : "Failed to request upload signatures.";
        markPhotosAsErrored(incomingPhotos, message);
        return;
      }

      await Promise.all(
        incomingPhotos.map(async (photo, index) => {
          const file = photo.file;
          const signature = signatures[index];
          if (!file || !signature) {
            updatePhoto(photo.id, {
              status: "error",
              errorMessage: "Missing upload data for this file.",
            });
            return;
          }

          updatePhoto(photo.id, {
            status: "uploading",
            publicId: signature.id,
            bucket: signature.folder,
          });

          try {
            const processedBlob = await processImage(
              file,
              80,
              "auto",
              "auto",
              "webp",
            );

            const processedFileName = file.name.replace(/\.[^/.]+$/, ".webp");
            const processedFile = new File([processedBlob], processedFileName, {
              type: processedBlob.type,
              lastModified: Date.now(),
            });

            const uploadedAsset = await uploadToCloudinary(
              processedFile,
              signature,
            );

            updatePhoto(photo.id, {
              status: "success",
              url: uploadedAsset.url,
              publicId: uploadedAsset.publicId,
              assetId: uploadedAsset.assetId,
              bytes: uploadedAsset.bytes,
              width: uploadedAsset.width,
              height: uploadedAsset.height,
              format: uploadedAsset.format,
              version: uploadedAsset.version,
              bucket: signature.folder,
              alt: photo.fileName,
              file: undefined,
              previewUrl: uploadedAsset.url,
            });
          } catch (error) {
            console.error("Cloudinary upload failed:", error);
            const message =
              error instanceof Error
                ? error.message
                : "Cloudinary upload failed.";

            updatePhoto(photo.id, {
              status: "error",
              errorMessage: message,
            });
          }
        }),
      );
    },
    [assignPhotos, fetchSignatures, markPhotosAsErrored, updatePhoto],
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

  return (
    <div className="space-y-4">
      <div
        {...getRootProps({
          className: `flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
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

      {photos.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-default-700">
            {photos.length} photo{photos.length !== 1 ? "s" : ""} added
          </p>
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {photos.map((photo) => (
                <CarouselItem
                  key={photo.id}
                  className="pl-2 md:pl-4 basis-[160px] shrink-0"
                >
                    <div className="relative group aspect-square overflow-hidden rounded-lg border border-default-200 bg-default-100">
                      <Image
                        src={photo.url && photo.url.length > 0 ? photo.url : photo.previewUrl}
                        alt={photo.fileName}
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
                      onPress={() => handleRemove(photo.id)}
                      aria-label={`Remove ${photo.fileName}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    {photo.status === "uploading" && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}

                    {photo.status === "error" && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-danger-500/70 p-3 text-center text-white">
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-xs font-semibold">
                          Upload failed
                        </span>
                        {photo.errorMessage && (
                          <span className="text-[10px] leading-tight">
                            {photo.errorMessage}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs text-white">
                      <p className="truncate">{photo.fileName}</p>
                      <p className="text-[10px] capitalize">
                        {photo.status === "success"
                          ? "Uploaded"
                          : photo.status === "uploading"
                            ? "Uploading…"
                            : photo.status === "error"
                              ? "Error"
                              : "Pending"}
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
