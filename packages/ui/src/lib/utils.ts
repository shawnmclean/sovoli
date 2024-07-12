import { type ClassValue, clsx } from "clsx";
import { PressableStateCallbackType } from "react-native";
import { twMerge } from "tailwind-merge";
import { Platform } from "react-native";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function isTextChildren(
  children:
    | React.ReactNode
    | ((state: PressableStateCallbackType) => React.ReactNode)
) {
  return Array.isArray(children)
    ? children.every((child) => typeof child === "string")
    : typeof children === "string";
}

export const isIos = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";
export const isWeb = Platform.OS === "web";
