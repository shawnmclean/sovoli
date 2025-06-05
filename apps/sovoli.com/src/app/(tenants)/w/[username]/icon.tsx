// apps/sovoli.com/src/app/icon.tsx
import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

interface Props {
  params: Promise<{ username: string }>;
}

// This must be an async function to access params in Next.js route handlers
export default async function Icon({ params }: Props) {
  const { username } = await params;

  const firstLetter = username[0]?.toUpperCase() ?? "W";

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #800080 0%, #ff00ff 100%)",
          borderRadius: "50%",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "SignPainter, 'Brush Script MT', cursive, sans-serif",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          {firstLetter}
        </span>
      </div>
    ),
    { ...size },
  );
}
