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

export async function getCroppedImage(options: GetCroppedImageOptions) {
  const image = await createImage(options.imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = options.crop.width;
  canvas.height = options.crop.height;

  ctx?.drawImage(
    image,
    options.crop.x,
    options.crop.y,
    options.crop.width,
    options.crop.height,
    0,
    0,
    options.crop.width,
    options.crop.height,
  );

  let blob = await toBlobAsync(canvas, "image/jpeg", 0.8); // Use JPEG for better compression
  if (!blob) {
    throw new Error("Failed to create Blob from canvas.");
  }

  let sizeInMB = blob.size / (1024 * 1024); // Convert size to MB

  // If the image exceeds 3MB, resize it
  while (sizeInMB > 3) {
    // Scale down the canvas dimensions
    canvas.width = Math.floor(canvas.width * 0.9);
    canvas.height = Math.floor(canvas.height * 0.9);

    ctx?.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx?.drawImage(
      image,
      options.crop.x,
      options.crop.y,
      options.crop.width,
      options.crop.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    // Recreate the blob with scaled-down canvas
    blob = await toBlobAsync(canvas, "image/jpeg", 0.8);
    if (!blob) {
      throw new Error("Failed to create Blob from canvas.");
    }

    sizeInMB = blob.size / (1024 * 1024); // Update size
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
