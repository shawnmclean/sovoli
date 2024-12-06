export interface CropOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GetCroppedImageOptions {
  imageSrc: string;
  crop: CropOptions;
}

export async function getCroppedImage(
  options: GetCroppedImageOptions,
): Promise<File> {
  const image = await createImage(options.imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Failed to get canvas rendering context.");

  // Helper function to draw and create a Blob
  const drawAndCreateBlob = async (
    width: number,
    height: number,
  ): Promise<Blob> => {
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      image,
      options.crop.x,
      options.crop.y,
      options.crop.width,
      options.crop.height,
      0,
      0,
      width,
      height,
    );
    const blob = await toBlobAsync(canvas, "image/jpeg", 0.8);
    if (!blob) throw new Error("Failed to create Blob from canvas.");
    return blob;
  };

  // Draw the initial cropped image
  let blob = await drawAndCreateBlob(options.crop.width, options.crop.height);

  // Resize the image until it meets the size threshold
  while (blob.size / (1024 * 1024) > 3) {
    const newWidth = Math.floor(canvas.width * 0.9);
    const newHeight = Math.floor(canvas.height * 0.9);
    blob = await drawAndCreateBlob(newWidth, newHeight);
  }

  // Return the final cropped and resized image as a File
  return new File([blob], "cropped-image.jpg", { type: "image/jpeg" });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.setAttribute("crossOrigin", "anonymous"); // To avoid CORS issues
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error(`Failed to load image from URL: ${url}`));
    image.src = url;
  });
}
function toBlobAsync(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality?: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    if (mimeType === "image/jpeg" || mimeType === "image/webp") {
      canvas.toBlob(resolve, mimeType, quality);
    } else {
      canvas.toBlob(resolve, mimeType);
    }
  });
}
