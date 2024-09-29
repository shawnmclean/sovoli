import type { ComponentProps } from "react";
import { cssInterop } from "nativewind";
import { SolitoImage } from "solito/image";

const ImageWrapper = (
  props: ComponentProps<typeof SolitoImage> & { className?: string },
) => {
  return <SolitoImage {...props} />;
};

cssInterop(ImageWrapper, {
  className: {
    target: "style",
  },
});

export const Image = ImageWrapper;
