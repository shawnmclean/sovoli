"use client";

import type { SelectMediaAssetSchema } from "@sovoli/db/schema";
import type { AvatarProps } from "@sovoli/ui/components/avatar";
import { Avatar } from "@sovoli/ui/components/avatar";
import { CldImage } from "next-cloudinary";

export interface MediaAssetAvatarProps extends Omit<AvatarProps, "src"> {
  mediaAsset: SelectMediaAssetSchema | null;
}

export function MediaAssetAvatar({
  mediaAsset,
  ...avatarProps
}: MediaAssetAvatarProps) {
  return (
    <Avatar
      {...avatarProps}
      ImgComponent={CldImage}
      imgProps={{
        src: mediaAsset ? `${mediaAsset.bucket}/${mediaAsset.id}` : "",
      }}
    />
  );
}
