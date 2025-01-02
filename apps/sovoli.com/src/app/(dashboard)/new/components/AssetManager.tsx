import type { FileRejection } from "react-dropzone";
import { useCallback, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@sovoli/ui/components/carousel";
import { Image } from "@sovoli/ui/components/image";
import { CloudUpload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { tv } from "tailwind-variants";

import { useAssetFileUpload } from "~/hooks/useAssetFileUpload";

const dropzoneStyles = tv({
  base: "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg",
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
  onFileUploaded: (file: File, id: string, path: string) => void;
}

export const AssetManager = ({ onFileUploaded }: AssetManagerProps) => {
  const { files, addFiles, removeFile } = useAssetFileUpload({
    onFileUploaded,
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
                  <div className="relative h-[500px] w-[100%]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative h-48 w-48 items-center rounded-lg bg-gray-200">
                        <Image
                          src={file.preview}
                          alt="Preview"
                          className="object-contain"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white"
                          onClick={() => removeFile(file.file)}
                        >
                          ✕
                        </button>
                      </div>
                      <div>
                        {file.status === "uploading" && <p>Uploading...</p>}
                        {file.status === "success" && (
                          <p>Uploaded successfully!</p>
                        )}
                        {file.status === "error" && <p>Upload failed.</p>}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <div className="flex flex-col items-center justify-center">
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
