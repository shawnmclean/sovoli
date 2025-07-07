import { ImageResponse } from "next/og";
import { getOrgInstanceByUsername } from "../lib/getOrgInstanceByUsername";
import type { DocumentRequirement } from "~/modules/academics/types";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function OpenGraphImage({ params }: Props) {
  const { username } = await params;
  const orgInstance = await getOrgInstanceByUsername(username);

  if (!orgInstance) {
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
            background: "linear-gradient(135deg, #800080 0%, #ff00ff 100%)",
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #800080 0%, #ff00ff 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "4px solid #fff",
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontSize: 40,
                  fontWeight: "bold",
                  fontFamily:
                    "SignPainter, 'Brush Script MT', cursive, sans-serif",
                }}
              >
                S
              </span>
            </div>
          </div>
          <h1
            style={{
              fontSize: 120,
              fontWeight: "bold",
              margin: 0,
              textAlign: "center",
            }}
          >
            Programs
          </h1>
        </div>
      ),
      { ...size },
    );
  }

  const { org, academicModule } = orgInstance;

  const programs = academicModule?.programs ?? [];

  // Get program names and requirements
  const programList = programs
    .map((program) => {
      const programName =
        program.name ?? program.standardProgramVersion?.program.name ?? "";
      const requirements =
        program.requirements ??
        program.standardProgramVersion?.requirements ??
        [];
      const ageRequirement = requirements.find((r) => r.type === "age");
      const documentRequirements = requirements.filter(
        (r) => r.type === "document",
      );

      return {
        name: programName,
        ageReq: ageRequirement?.ageRange
          ? `Ages ${ageRequirement.ageRange.minAgeYears ?? 0}-${ageRequirement.ageRange.maxAgeYears ?? ""} years`
          : null,
        documents: documentRequirements
          .map((r: DocumentRequirement) => r.name)
          .join(", "),
      };
    })
    .filter((p) => p.name);

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #800080 0%, #ff00ff 100%)",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          padding: "40px",
          position: "relative",
        }}
      >
        {/* Top: Org Logo and Name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "20px",
              border: "2px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              {org.name.charAt(0)}
            </span>
          </div>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              margin: 0,
            }}
          >
            {org.name}
          </h2>
        </div>

        {/* Middle: Main Content */}
        <div
          style={{
            display: "flex",
            flex: 1,
            gap: "40px",
            alignItems: "flex-start",
          }}
        >
          {/* Left: Programs Section */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Big "Our Programs" heading */}
            <h1
              style={{
                fontSize: "64px",
                fontWeight: "bold",
                margin: "0 0 30px 0",
                textAlign: "left",
              }}
            >
              Our Programs
            </h1>

            {/* Programs List */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {programList.slice(0, 4).map((program, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "rgba(255, 255, 255, 0.1)",
                    padding: "16px 20px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "#fff",
                      marginRight: "16px",
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        marginBottom: "6px",
                      }}
                    >
                      {program.name}
                    </span>
                    {program.ageReq && (
                      <span
                        style={{
                          fontSize: "16px",
                          opacity: 0.8,
                        }}
                      >
                        {program.ageReq}
                      </span>
                    )}
                    {program.documents && (
                      <span
                        style={{
                          fontSize: "14px",
                          opacity: 0.7,
                          marginTop: "4px",
                        }}
                      >
                        Documents: {program.documents}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {programList.length > 4 && (
                <div
                  style={{
                    textAlign: "left",
                    fontSize: "18px",
                    opacity: 0.8,
                    marginTop: "12px",
                  }}
                >
                  +{programList.length - 4} more programs
                </div>
              )}
            </div>
          </div>

          {/* Right: Apply Now Button */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "200px",
            }}
          >
            <div
              style={{
                background: "#fff",
                color: "#800080",
                padding: "20px 30px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                border: "2px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                Apply Now
              </span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom: Sovoli Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              opacity: 0.8,
            }}
          >
            <span
              style={{
                fontSize: "16px",
                fontWeight: "500",
              }}
            ></span>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #800080 0%, #ff00ff 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: "bold",
                  fontFamily:
                    "SignPainter, 'Brush Script MT', cursive, sans-serif",
                }}
              >
                S
              </span>
            </div>
            <span
              style={{
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Sovoli
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
