import type { SelectMediaAssetSchema } from "@sovoli/db/schema";
import Image from "next/image";
import { MediaAssetHost } from "@sovoli/db/schema";
import { CldImage } from "next-cloudinary";

import supabaseLoader from "~/loaders/supabaseImageLoader";

export interface MediaAssetViewerProps {
  mediaAsset: SelectMediaAssetSchema;
  className?: string;
}

export function MediaAssetViewer({
  mediaAsset,
  className,
}: MediaAssetViewerProps) {
  if (mediaAsset.host === MediaAssetHost.Supabase && mediaAsset.path) {
    return (
      <Image
        src={`${mediaAsset.bucket}/${mediaAsset.path}`}
        alt={mediaAsset.name ?? "Media Asset"}
        className={className}
        fill
        loader={supabaseLoader}
      />
    );
  }
  if (mediaAsset.host === MediaAssetHost.Cloudinary) {
    return (
      <CldImage
        src={`${mediaAsset.bucket}/${mediaAsset.id}`}
        alt={mediaAsset.name ?? "Media Asset"}
        className={className}
        fill
      />
    );
  }
}
