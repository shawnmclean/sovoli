import { SolitoImage } from "solito/image";
import { cssInterop } from "nativewind";
import { ComponentProps } from "react";

const ImageWrapper = (
  props: ComponentProps<typeof SolitoImage> & { className?: string }
) => {
  return <SolitoImage {...props} />;
};

// TODO: this throws an error on nextjs, but works fine on expo
// cssInterop(ImageWrapper, {
//   className: {
//     target: "style",
//   },
// });

export const Image = ImageWrapper;
