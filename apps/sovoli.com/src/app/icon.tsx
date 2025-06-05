// apps/sovoli.com/src/app/icon.tsx
import { ImageResponse } from "next/og";
import { LogoSVG } from "../components/Logo/LogoSVG";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<LogoSVG width={32} height={32} />, { ...size });
}
