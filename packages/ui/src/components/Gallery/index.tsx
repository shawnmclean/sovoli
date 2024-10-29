import Image from "next/image";

export interface GalleryProps {
  images: { src: string; alt: string }[];
}

export function Gallery({ images }: GalleryProps) {
  if (!images[0]) return null;

  return (
    <div className="grid h-96 grid-cols-2 gap-4 md:h-[500px]">
      {/* Main Image */}
      <div className="relative col-span-2 h-full md:col-span-1">
        <div className="relative h-full w-full">
          <Image
            src={images[0].src}
            alt={images[0].alt || "Main Image"}
            width={400}
            height={400}
            className="rounded-lg"
            priority
          />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-1 md:gap-2">
        {images.slice(1, 5).map((image, index) => (
          <div key={index} className="relative h-24 md:h-32 lg:h-40">
            <div className="relative h-full w-full">
              <Image
                src={image.src}
                alt={image.alt || `Thumbnail ${index + 1}`}
                className="rounded-lg"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
