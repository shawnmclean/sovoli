"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { CloudUpload, X, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@sovoli/ui/components/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";

export interface DamagePhotosUploadProps {
  photos: File[];
  onPhotosChange: (files: File[]) => void;
}

interface PhotoWithPreview {
  file: File;
  preview: string;
  uploadState: "pending" | "uploading" | "success" | "error";
}

export function DamagePhotosUpload({
  photos,
  onPhotosChange,
}: DamagePhotosUploadProps) {
  const [uploadingIndexes] = useState<Set<number>>(new Set());

  // Create preview URLs for all photos
  const photosWithPreview = useMemo<PhotoWithPreview[]>(() => {
    return photos.map((photo, index) => ({
      file: photo,
      preview: URL.createObjectURL(photo),
      uploadState: uploadingIndexes.has(index)
        ? ("uploading" as const)
        : ("success" as const),
    }));
  }, [photos, uploadingIndexes]);

  // Clean up object URLs when component unmounts or photos change
  useEffect(() => {
    return () => {
      photosWithPreview.forEach((photo) => {
        URL.revokeObjectURL(photo.preview);
      });
    };
  }, [photosWithPreview]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPhotos = [...photos, ...acceptedFiles];
      onPhotosChange(newPhotos);
    },
    [photos, onPhotosChange],
  );

  const handleRemove = useCallback(
    (indexToRemove: number) => {
      // Revoke the object URL before removing
      const photoToRemove = photosWithPreview[indexToRemove];
      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.preview);
      }
      const newPhotos = photos.filter((_, index) => index !== indexToRemove);
      onPhotosChange(newPhotos);
    },
    [photos, onPhotosChange, photosWithPreview],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    onDrop: handleDrop,
  });

  return (
    <div className="space-y-4">
      {/* Dropzone */}
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
            (Only *.jpeg and *.png images will be accepted)
          </p>
        </div>
      </div>

      {/* Image List */}
      {photosWithPreview.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-default-700">
            {photosWithPreview.length} photo
            {photosWithPreview.length !== 1 ? "s" : ""} selected
          </p>
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {photosWithPreview.map((photo, index) => (
                <CarouselItem
                  key={`${photo.file.name}-${index}`}
                  className="pl-2 md:pl-4 basis-[160px] shrink-0"
                >
                  <div className="relative group aspect-square rounded-lg overflow-hidden border border-default-200 bg-default-100">
                    {/* Image Preview */}
                    <Image
                      src={photo.preview}
                      alt={photo.file.name}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />

                    {/* Remove Button */}
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="solid"
                      className="absolute top-2 right-2 z-10"
                      onPress={() => handleRemove(index)}
                      aria-label={`Remove ${photo.file.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    {/* Upload State Indicator */}
                    {photo.uploadState === "uploading" && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      </div>
                    )}

                    {/* Image Name */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                      {photo.file.name}
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
