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

  const blob = await toBlobAsync(canvas, "image/png");
  if (!blob) {
    throw new Error("Failed to create Blob from canvas.");
  }

  return new File([blob], "cropped-image.png", { type: "image/png" });
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
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, mimeType));
}
