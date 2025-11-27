import type { ImageFormat } from "./types";

/**
 * Returns the mime type given a string
 *
 * @param {ImageFormat} format - Image format [png, webp, bmp, jpeg, gif].
 * @returns {string} Returns mime type - defaults to 'image/jpeg' for unsupported formats.
 */
const getMimeType = (format: ImageFormat): string => {
  const mimeTypes: Record<ImageFormat, string> = {
    png: "image/png",
    webp: "image/webp",
    bmp: "image/bmp",
    gif: "image/gif",
    jpeg: "image/jpeg",
  };
  return mimeTypes[format] || "image/jpeg";
};

/**
 * Process an image with specific dimensions and return a blob.
 *
 * @param {HTMLImageElement} img - The image element.
 * @param {number} targetWidth - Target width.
 * @param {number} targetHeight - Target height.
 * @param {string} mimeType - MIME type for the output.
 * @param {number} quality - Image quality (0-1).
 * @returns {Promise<Blob>} A promise resolving to the processed image Blob.
 */
const processImageWithDimensions = async (
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  mimeType: string,
  quality: number,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Failed to get canvas context."));
      return;
    }

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob === null) {
          return reject(new Error("Failed to generate image blob."));
        }
        resolve(
          new Blob([blob], {
            type: mimeType,
          }),
        );
      },
      mimeType,
      quality,
    );
  });
};

/**
 * Compress, resize, and convert an image Blob/File.
 * Automatically downscales images to fit within maxWidth while maintaining aspect ratio.
 *
 * @param {Blob | File} imgBlob The image blob to manipulate.
 * @param {number} [maxWidth=1920] Maximum width constraint. 1920 is a safe default for retina displays.
 * @param {number} [quality=0.8] The image quality (0-1). Default 0.8 provides good quality with smaller file sizes.
 * @param {ImageFormat} [format='jpeg'] The desired image format.
 * @returns {Promise<Blob>} A promise resolving to the processed image Blob.
 */
export const processImage = async (
  imgBlob: Blob | File,
  maxWidth = 1920, // Safe default for retina displays
  quality = 0.8,
  format: ImageFormat = "jpeg",
): Promise<Blob> => {
  if (!(imgBlob instanceof Blob)) {
    throw new TypeError(`Expected a Blob or File, but got ${typeof imgBlob}.`);
  }

  if (imgBlob.size === 0) {
    throw new Error(
      "Failed to load the image. The file might be corrupt or empty.",
    );
  }

  if (maxWidth <= 0) {
    throw new RangeError("maxWidth must be greater than 0.");
  }

  if (quality <= 0 || quality > 1) {
    throw new RangeError("Quality must be between 0 and 1.");
  }

  const mimeType = getMimeType(format);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;

      img.onload = async () => {
        try {
          // Calculate dimensions respecting maxWidth constraint
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          const targetWidth = Math.min(img.naturalWidth, maxWidth);
          const targetHeight = Math.round(targetWidth / aspectRatio);

          const processedBlob = await processImageWithDimensions(
            img,
            targetWidth,
            targetHeight,
            mimeType,
            quality,
          );

          resolve(processedBlob);
        } catch (error) {
          reject(error instanceof Error ? error : new Error(String(error)));
        }
      };

      img.onerror = () => {
        reject(
          new Error(
            "Failed to load the image. The file might be corrupt or empty.",
          ),
        );
      };
    };

    reader.onerror = () =>
      reject(new Error("Failed to read the blob as a Data URL."));
    reader.readAsDataURL(imgBlob);
  });
};
