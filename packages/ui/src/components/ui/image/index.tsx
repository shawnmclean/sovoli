// TODO: we can switch back to NextUI Image when this is fixed: https://github.com/nextui-org/nextui/issues/2836

// import type { ImageProps as NextUIImageProps } from "@nextui-org/image";
// import type { ImageProps as NextImageProps } from "next/image";
// import type { FC } from "react";
import NextImage from "next/image";

// import { Image as NextUIImage } from "@nextui-org/image";

// // Combine the props from both NextUIImage and NextImage
// type CombinedImageProps = Omit<NextUIImageProps, "as"> & NextImageProps;

// export const Image: FC<CombinedImageProps> = ({ ...props }) => {
//   return <NextUIImage as={NextImage} {...props} />;
// };

export { NextImage as Image };
