import { ImageResponse } from "next/og";

export const alt = "Jamaica School Needs Intake";
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
            "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #0f172a 100%)",
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
            Document School Needs
          </h1>
          <p
            style={{
              fontSize: 32,
              margin: 0,
              marginTop: "16px",
              opacity: 0.95,
              maxWidth: "800px",
            }}
          >
            Share the supplies and support your campus requires after the
            hurricane.
          </p>
        </div>
      </div>
    ),
    { ...size },
  );
}
