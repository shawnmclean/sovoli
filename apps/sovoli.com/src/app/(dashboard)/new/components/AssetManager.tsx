import type { FileRejection } from "react-dropzone";
import { useCallback, useState } from "react";
import Image from "next/image";
import { Button } from "@sovoli/ui/components/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@sovoli/ui/components/carousel";
import { Spinner } from "@sovoli/ui/components/spinner";
import { CloudUpload, Trash2Icon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { tv } from "tailwind-variants";

import type { UploadSignature } from "../lib/generateUploadSignatures";
import type { UploadedAsset } from "~/hooks/useAssetFileUpload";
import { useAssetFileUpload } from "~/hooks/useAssetFileUpload";
import supabaseLoader from "~/loaders/supabaseImageLoader";

const dropzoneStyles = tv({
  base: "flex flex-col items-center justify-center h-64 w-full border-2 border-dashed rounded-lg",
  variants: {
    isDragActive: {
      true: "border-primary",
      false:
        "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500",
    },
    isFilesSelected: {
      true: "",
      false: "cursor-pointer",
    },
  },
});

export interface AssetManagerProps {
  name: string;
  onFileUploaded: (asset: UploadedAsset) => void;
  uploadSignatures?: UploadSignature[];
}

export const AssetManager = ({
  onFileUploaded,
  name,
  uploadSignatures,
}: AssetManagerProps) => {
  const { files, addFiles, removeFile } = useAssetFileUpload({
    onFileUploaded,
    uploadSignatures,
  });
  const [fileRejections, setFileRejections] = useState<FileRejection[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      addFiles(acceptedFiles);
      setFileRejections(fileRejections);
    },
    [addFiles],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: files.length > 0,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    onDrop,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps({
          className: dropzoneStyles({
            isDragActive,
            isFilesSelected: files.length > 0,
          }),
        })}
      >
        <input {...getInputProps()} title="upload file" className="sr-only" />
        {files.length > 0 ? (
          <Carousel className="w-full overflow-hidden rounded-lg">
            <CarouselContent>
              {files.map((file, i) => (
                <CarouselItem
                  key={i}
                  className="flex items-center justify-center"
                >
                  <div className="relative h-64 w-[100%]">
                    <Button
                      className="absolute right-1 top-1 z-20"
                      isIconOnly
                      onPress={() => removeFile(file.file)}
                      size="sm"
                      variant="ghost"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                    <Image
                      src={file.preview}
                      alt="Preview"
                      className="object-contain"
                      fill
                      loader={supabaseLoader}
                    />
                    {file.uploadedAsset?.id && (
                      <input
                        type="hidden"
                        name={`${name}[${i}][id]`}
                        value={file.uploadedAsset.id}
                      />
                    )}
                    {(file.status === "uploading" ||
                      file.status === "idle") && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center justify-center rounded-lg bg-gray-300 bg-opacity-80 p-3">
                          <Spinner className="h-6 w-6" />
                        </div>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <div className="m-5 flex flex-col items-center justify-center">
            <CloudUpload className="mb-5 h-12 w-12 text-gray-600 dark:text-gray-300" />
            <p className="mb-2 text-lg text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              (Only *.jpeg and *.png images will be accepted)
            </p>
          </div>
        )}
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
    </div>
  );
};
