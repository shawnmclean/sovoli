"use client";

import { Button } from "@sovoli/ui/components/button";
import type { CarouselApi } from "@sovoli/ui/components/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@sovoli/ui/components/dialog";
import { AlertCircle, CloudUpload, Loader2, Play, X } from "lucide-react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useDropzone } from "react-dropzone";
import type { UploadSignature } from "~/core/cloudinary/generateUploadSignatures";
import { uploadToCloudinary } from "~/core/cloudinary/uploadToCloudinary";
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
  isVideo: boolean;
}

type DisplayItem =
  | {
      kind: "media";
      key: string;
      fileName: string;
      imageSrc: string;
      alt: string;
      status: "success";
      statusLabel: string;
      mediaType: "image" | "video";
      media: Media;
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
      mediaType: "image" | "video";
      previewUrl: string;
    };

const getFirstNonEmpty = (...values: (string | undefined)[]) =>
  values.find((value) => value !== undefined && value.trim().length > 0);

const getMediaKey = (media: Media) =>
  getFirstNonEmpty(
    media.publicId,
    media.id,
    media.assetId,
    media.url,
    media.caption,
    media.alt,
  ) ?? crypto.randomUUID();

const isVideoFile = (file: File): boolean => {
  return file.type.startsWith("video/");
};

interface CloudinaryVideoUploadResponse {
  asset_id: string;
  public_id: string;
  secure_url?: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  version: number;
  created_at: string;
  duration?: number;
  video?: {
    codec?: string;
    bit_rate?: number | string;
  };
  audio?: {
    codec?: string;
    bit_rate?: number | string;
  };
  frame_rate?: number;
  poster?: string;
}

const uploadVideoToCloudinary = async (
  file: File,
  signature: UploadSignature,
): Promise<{
  url: string;
  publicId: string;
  assetId: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  version: number;
  createdAt: string;
  duration?: number;
  videoCodec?: string;
  audioCodec?: string;
  fps?: number;
  bitrate?: number;
  audioBitrate?: number;
  posterUrl?: string;
}> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", signature.timestamp.toString());
  formData.append("signature", signature.signature);
  formData.append("public_id", signature.id);
  formData.append("folder", signature.folder);
  // Note: resource_type is not needed here as it's implied by the /video/upload endpoint
  formData.append("media_metadata", "true");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/video/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to upload video: ${response.status} ${response.statusText} - ${errorBody}`,
    );
  }

  const uploadResponse =
    (await response.json()) as CloudinaryVideoUploadResponse;

  const cloudName = signature.cloudName;
  const publicId = uploadResponse.public_id;

  return {
    url: uploadResponse.secure_url ?? uploadResponse.url,
    publicId: uploadResponse.public_id,
    assetId: uploadResponse.asset_id,
    width: uploadResponse.width,
    height: uploadResponse.height,
    bytes: uploadResponse.bytes,
    format: uploadResponse.format,
    version: uploadResponse.version,
    createdAt: uploadResponse.created_at,
    duration: uploadResponse.duration,
    videoCodec: uploadResponse.video?.codec,
    audioCodec: uploadResponse.audio?.codec,
    fps: uploadResponse.frame_rate,
    bitrate:
      typeof uploadResponse.video?.bit_rate === "string"
        ? parseInt(uploadResponse.video.bit_rate, 10)
        : uploadResponse.video?.bit_rate,
    audioBitrate:
      typeof uploadResponse.audio?.bit_rate === "string"
        ? parseInt(uploadResponse.audio.bit_rate, 10)
        : uploadResponse.audio?.bit_rate,
    posterUrl:
      uploadResponse.poster ??
      `https://res.cloudinary.com/${cloudName}/video/upload/so_0/${publicId}.jpg`,
  };
};

export interface ProjectMediaUploadProps {
  photos: Media[];
  username: string;
  onPhotosChange: (updater: (photos: Media[]) => Media[]) => void;
  onUploadStatusChange?: (hasPendingUploads: boolean) => void;
}

export function ProjectMediaUpload({
  photos,
  username,
  onPhotosChange,
  onUploadStatusChange,
}: ProjectMediaUploadProps) {
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const queueRef = useRef<UploadQueueItem[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const removeMediaByKey = useCallback(
    (key: string) => {
      onPhotosChange((current) =>
        current.filter((media) => getMediaKey(media) !== key),
      );
    },
    [onPhotosChange],
  );

  const handleRemove = useCallback(
    (key: string, kind: "media" | "queue") => {
      if (kind === "media") {
        removeMediaByKey(key);
      } else {
        removeQueueItem(key);
      }
    },
    [removeMediaByKey, removeQueueItem],
  );

  const displayItems = useMemo<DisplayItem[]>(() => {
    const mediaItems: DisplayItem[] = photos.map((media) => ({
      key: getMediaKey(media),
      kind: "media" as const,
      fileName:
        getFirstNonEmpty(media.caption, media.alt, media.publicId) ??
        "Uploaded media",
      imageSrc: media.url,
      alt:
        getFirstNonEmpty(media.alt, media.caption, media.publicId) ??
        "Project media",
      status: "success",
      statusLabel: "Uploaded",
      mediaType: media.type === "video" ? "video" : "image",
      media,
    }));

    const queueItems: DisplayItem[] = queue.map((item) => ({
      key: item.id,
      kind: "queue" as const,
      fileName: item.fileName,
      imageSrc: item.isVideo ? item.previewUrl : item.previewUrl, // For videos, we'll show a video element
      alt: item.fileName,
      status: item.status,
      errorMessage: item.errorMessage,
      statusLabel: item.status === "uploading" ? "Uploading…" : "Error",
      mediaType: item.isVideo ? "video" : "image",
      previewUrl: item.previewUrl,
    }));

    return [...mediaItems, ...queueItems];
  }, [photos, queue]);

  const previewItems = useMemo(() => displayItems, [displayItems]);

  const handlePreview = useCallback(
    (itemKey: string) => {
      const previewIndex = previewItems.findIndex(
        (item) => item.key === itemKey,
      );
      if (previewIndex >= 0) {
        setPreviewIndex(previewIndex);
        onOpen();
      }
    },
    [onOpen, previewItems],
  );

  const fetchSignatures = useCallback(
    async (count: number, isVideo: boolean) => {
      const trimmedUsername = username.trim();
      const response = await fetch("/api/needs/upload-signatures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          count,
          username: trimmedUsername.length > 0 ? trimmedUsername : undefined,
          resourceType: isVideo ? "video" : undefined,
          mediaMetadata: isVideo ? true : undefined,
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
        isVideo: isVideoFile(file),
      }));

      setQueue((current) => [...current, ...incomingItems]);

      // Separate files by type to request appropriate signatures
      const videoFiles = incomingItems.filter((item) => item.isVideo);
      const imageFiles = incomingItems.filter((item) => !item.isVideo);

      // Create a map to track which signature index each item should use
      const signatureMap = new Map<
        string,
        { signature: UploadSignature; index: number }
      >();
      let videoIndex = 0;
      let imageIndex = 0;

      let videoSignatures: UploadSignature[] = [];
      let imageSignatures: UploadSignature[] = [];

      try {
        if (videoFiles.length > 0) {
          videoSignatures = await fetchSignatures(videoFiles.length, true);
        }
        if (imageFiles.length > 0) {
          imageSignatures = await fetchSignatures(imageFiles.length, false);
        }

        // Map signatures to items
        for (const item of incomingItems) {
          if (item.isVideo) {
            const sig = videoSignatures[videoIndex];
            if (sig) {
              signatureMap.set(item.id, {
                signature: sig,
                index: videoIndex,
              });
              videoIndex++;
            }
          } else {
            const sig = imageSignatures[imageIndex];
            if (sig) {
              signatureMap.set(item.id, {
                signature: sig,
                index: imageIndex,
              });
              imageIndex++;
            }
          }
        }
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
        incomingItems.map(async (item) => {
          const { file } = item;
          // Get the appropriate signature from the map
          const signatureData = signatureMap.get(item.id);
          if (!signatureData) {
            updateQueueItems([item.id], (queueItem) => ({
              ...queueItem,
              status: "error",
              errorMessage: "Missing upload data for this file.",
            }));
            return;
          }

          const { signature } = signatureData;

          try {
            if (item.isVideo) {
              // Upload video directly without processing
              const uploadedAsset = await uploadVideoToCloudinary(
                file,
                signature,
              );

              const uploadedMedia: Media = {
                type: "video",
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
                duration: uploadedAsset.duration,
                videoCodec: uploadedAsset.videoCodec,
                audioCodec: uploadedAsset.audioCodec,
                fps: uploadedAsset.fps,
                bitrate: uploadedAsset.bitrate,
                audioBitrate: uploadedAsset.audioBitrate,
                posterUrl: uploadedAsset.posterUrl,
              };

              onPhotosChange((current) => [...current, uploadedMedia]);
              removeQueueItem(item.id);
            } else {
              // Process and upload image
              const processedBlob = await processImage(file);

              const processedFileName = file.name.replace(/\.[^/.]+$/, ".webp");
              const processedFile = new File(
                [processedBlob],
                processedFileName,
                {
                  type: processedBlob.type,
                  lastModified: Date.now(),
                },
              );

              const uploadedAsset = await uploadToCloudinary(
                processedFile,
                signature,
              );

              const uploadedMedia: Media = {
                type: "image",
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

              onPhotosChange((current) => [...current, uploadedMedia]);
              removeQueueItem(item.id);
            }
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
      "video/mp4": [],
      "video/webm": [],
      "video/quicktime": [], // .mov files
    },
    onDrop: (acceptedFiles) => {
      void handleDrop(acceptedFiles);
    },
  });

  useEffect(() => {
    onUploadStatusChange?.(queue.length > 0);
  }, [onUploadStatusChange, queue]);

  const totalCount = photos.length + queue.length;

  return (
    <>
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
            name="project-media"
            id="project-media"
            className="sr-only"
          />
          <div className="flex flex-col items-center justify-center">
            <CloudUpload className="mb-3 h-10 w-10 text-default-500" />
            <p className="mb-1 text-sm font-medium text-default-700">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
          </div>
        </div>

        {displayItems.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-default-700">
              {totalCount} {totalCount === 1 ? "item" : "items"} added
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
                      {item.mediaType === "video" ? (
                        <video
                          src={
                            item.kind === "media"
                              ? item.media.url
                              : item.previewUrl
                          }
                          className="object-cover w-full h-full"
                          muted
                          playsInline
                          preload="metadata"
                          poster={
                            item.kind === "media" && item.media.type === "video"
                              ? item.media.posterUrl
                              : undefined
                          }
                        />
                      ) : (
                        <Image
                          src={item.imageSrc}
                          alt={item.alt}
                          fill
                          className="object-cover"
                          sizes="160px"
                        />
                      )}

                      {item.mediaType === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      )}

                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="solid"
                        className="absolute top-2 right-2 z-20"
                        onPress={() =>
                          handleRemove(
                            item.key,
                            item.kind === "media" ? "media" : "queue",
                          )
                        }
                        aria-label={`Remove ${item.fileName}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>

                      <button
                        type="button"
                        className="absolute inset-0 z-10 cursor-pointer"
                        onClick={() => handlePreview(item.key)}
                        aria-label={`Preview ${item.fileName}`}
                      />

                      {item.kind === "queue" && item.status === "uploading" && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50">
                          <Loader2 className="h-6 w-6 animate-spin text-white" />
                        </div>
                      )}

                      {item.kind === "queue" && item.status === "error" && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-danger-500/70 p-3 text-center text-white">
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

      <PreviewModal
        items={previewItems}
        isOpen={isOpen}
        onClose={onClose}
        initialIndex={previewIndex ?? 0}
      />
    </>
  );
}

function PreviewModal({
  items,
  isOpen,
  onClose,
  initialIndex,
}: {
  items: DisplayItem[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex: number;
}) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(initialIndex);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!api) return;
    startTransition(() => {
      setCurrent(api.selectedScrollSnap());
    });
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (isOpen && api) {
      api.scrollTo(initialIndex);
      startTransition(() => {
        setCurrent(initialIndex);
      });
    }
  }, [isOpen, api, initialIndex]);

  if (items.length === 0) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="full" hideCloseButton>
      <ModalContent>
        <ModalHeader className="flex items-center justify-between">
          <Button variant="light" isIconOnly radius="full" onPress={onClose}>
            <X className="h-5 w-5" />
          </Button>
          <span className="text-sm">
            {current + 1} / {items.length}
          </span>
        </ModalHeader>
        <ModalBody className="p-0 flex-1 overflow-hidden">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              startIndex: initialIndex,
            }}
            setApi={setApi}
            className="w-full h-full"
          >
            <CarouselContent className="h-full -ml-0">
              {items.map((item, index) => (
                <CarouselItem key={item.key} className="basis-full pl-0 h-full">
                  <div className="w-full h-full relative flex items-center justify-center">
                    {item.mediaType === "video" ? (
                      <video
                        src={
                          item.kind === "media"
                            ? item.media.url
                            : item.previewUrl
                        }
                        className="object-contain w-full h-full max-w-full max-h-full"
                        controls
                        autoPlay={index === current}
                        loop
                        muted
                        playsInline
                        poster={
                          item.kind === "media" && item.media.type === "video"
                            ? item.media.posterUrl
                            : undefined
                        }
                      />
                    ) : item.kind === "media" && item.media.publicId ? (
                      <CldImage
                        src={item.media.publicId}
                        alt={item.media.alt ?? `Media ${index + 1}`}
                        width={item.media.width ?? 1920}
                        height={item.media.height ?? 1080}
                        sizes="100vw"
                        className="object-contain"
                        priority
                      />
                    ) : (
                      <Image
                        src={item.imageSrc}
                        alt={item.alt}
                        fill
                        className="object-contain"
                        sizes="100vw"
                      />
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
