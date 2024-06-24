/// <reference types="nativewind/types" />

declare module "nativewind" {
  import { ComponentType } from "react";
  import { TextProps } from "react-native";

  export interface SlottableTextProps extends TextProps {
    className?: string;
  }

  const SlottableText: ComponentType<SlottableTextProps>;
  export default SlottableText;
}
