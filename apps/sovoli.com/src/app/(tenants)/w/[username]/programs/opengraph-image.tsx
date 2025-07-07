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

  const {
    websiteModule: { website },
    academicModule,
  } = orgInstance;

  const programs = academicModule?.programs ?? [];
  const programCycles = academicModule?.programCycles ?? [];

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

  // Get cycle information
  const _cycleList = programCycles
    .map((cycle) => {
      const programName =
        cycle.orgProgram.name ??
        cycle.orgProgram.standardProgramVersion?.program.name ??
        "";
      const cycleLabel =
        cycle.academicCycle.customLabel ??
        cycle.academicCycle.globalCycle?.label ??
        cycle.academicCycle.globalCycle?.standardCycleKey ??
        "";

      return {
        name: programName,
        cycle: cycleLabel,
        hasRegistration: !!cycle.registrationPeriod,
      };
    })
    .filter((c) => c.name);

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
        }}
      >
        {/* Header */}
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
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #800080 0%, #ff00ff 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "3px solid #fff",
              marginRight: "20px",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: 30,
                fontWeight: "bold",
                fontFamily:
                  "SignPainter, 'Brush Script MT', cursive, sans-serif",
              }}
            >
              S
            </span>
          </div>
          <h1
            style={{
              fontSize: 80,
              fontWeight: "bold",
              margin: 0,
            }}
          >
            Programs
          </h1>
        </div>

        {/* Organization Name */}
        <p
          style={{
            fontSize: 24,
            margin: "0 0 2rem 0",
            textAlign: "center",
            opacity: 0.9,
          }}
        >
          {website.siteName}
        </p>

        {/* Programs List */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            flex: 1,
            overflow: "hidden",
          }}
        >
          {programList.slice(0, 4).map((program, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#fff",
                  marginRight: "12px",
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
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                >
                  {program.name}
                </span>
                {program.ageReq && (
                  <span
                    style={{
                      fontSize: "14px",
                      opacity: 0.8,
                    }}
                  >
                    {program.ageReq}
                  </span>
                )}
                {program.documents && (
                  <span
                    style={{
                      fontSize: "12px",
                      opacity: 0.7,
                      marginTop: "2px",
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
                textAlign: "center",
                fontSize: "16px",
                opacity: 0.8,
                marginTop: "8px",
              }}
            >
              +{programList.length - 4} more programs
            </div>
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
