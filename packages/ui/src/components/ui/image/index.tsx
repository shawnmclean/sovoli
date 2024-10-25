import type { ImageProps as NextUIImageProps } from "@nextui-org/image";
import { Image as NextUIImage } from "@nextui-org/image";
import type { ImageProps as NextImageProps } from "next/image";
import NextImage from "next/image";
import type { FC } from "react";

// Combine the props from both NextUIImage and NextImage
type CombinedImageProps = Omit<NextUIImageProps, 'as'> & NextImageProps;

export const Image: FC<CombinedImageProps> = ({ ...props }) => {
  console.log('image')
  return <NextUIImage as={NextImage} {...props} />;
};
