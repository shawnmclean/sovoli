import { ImageResponse } from "next/og";

export const alt = "Jamaica Hurricane Relief Support";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #ff6b00 0%, #ff8c42 50%, #ff6b00 100%)",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: "24px",
          }}
        >
          <h1
            style={{
              fontSize: 96,
              fontWeight: "bold",
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: "-2px",
            }}
          >
            Jamaica Hurricane
          </h1>
          <h2
            style={{
              fontSize: 64,
              fontWeight: "bold",
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: "-1px",
            }}
          >
            Relief Support
          </h2>
          <p
            style={{
              fontSize: 32,
              margin: 0,
              marginTop: "16px",
              opacity: 0.95,
              maxWidth: "800px",
            }}
          >
            Pledge a care package or financial support to help communities
            recover
          </p>
        </div>
      </div>
    ),
    { ...size },
  );
}
