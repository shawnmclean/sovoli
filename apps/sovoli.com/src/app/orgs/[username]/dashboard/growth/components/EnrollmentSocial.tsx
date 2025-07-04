import { Image } from "@sovoli/ui/components/image";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { Globe, RocketIcon, Bell, CheckCircle } from "lucide-react";
import type { OrgInstance } from "~/modules/organisations/types";
import QRCode from "react-qr-code";

export interface EnrollmentSocialProps {
  orgInstance: OrgInstance;
}

export function EnrollmentSocial({ orgInstance }: EnrollmentSocialProps) {
  const { org } = orgInstance;

  return (
    <div>
      <div
        style={{
          all: "initial",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          color: "#1e3a8a",
          fontSize: "16px",
          backgroundColor: "white",
          lineHeight: 1.5,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        {/* Row 1: Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "1.5rem",
            backgroundColor: "#1e3a8a",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "9999px",
              padding: "0.5rem 1.5rem",
            }}
          >
            <h1
              style={{
                fontSize: "2.4rem",
                fontWeight: "700",
                color: "#1e3a8a",
                display: "flex",
                alignItems: "center",
                gap: "0.7rem",
                margin: 0,
              }}
            >
              <Bell
                style={{ width: "2.5rem", height: "2.5rem", flexShrink: 0 }}
              />
              SEPTEMBER APPLICATIONS OPEN
            </h1>
          </div>
        </div>

        {/* Row 2: Hero Image */}
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(to right, #1e3a8a, #1e40af, #7c3aed)",
              borderRadius: "0.75rem",
              padding: "0.5rem",
              width: "100%",
              position: "relative",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          >
            {/* Limited Space Badge */}
            <div
              style={{
                position: "absolute",
                right: "-1rem",
                zIndex: 50,
              }}
            >
              <div
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  padding: "0.3rem 1rem",
                  borderRadius: "0.5rem",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  transform: "rotate(12deg)",
                  fontWeight: "700",
                  fontSize: "1.4rem",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              >
                Limited Space Available!
              </div>
            </div>
            <Image
              src="/orgs/private-schools/guyana/modernacademy/programs/pre-nursery.webp"
              alt="School Programs"
              width={800}
              height={250}
              style={{
                width: "100%",
                objectFit: "cover",
                objectPosition: "top",
                borderRadius: "0.5rem",
              }}
            />
          </div>
        </div>

        <div
          style={{
            padding: "1.2rem 2rem 0.7rem 2rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.3rem",
              textAlign: "center",
            }}
          >
            {[
              {
                title: "Pre-Nursery",
                age: "Ages 2–3",
              },
              {
                title: "Nursery",
                age: "Ages 3–5",
              },
              {
                title: "Primary",
                age: "Grades 1–6",
              },
              {
                title: "Secondary",
                age: "Forms 1–5",
              },
            ].map((p) => (
              <div
                key={p.title}
                style={{
                  backgroundColor: "#f3f7fd",
                  border: "2px solid #bfdbfe",
                  borderRadius: "1.1rem",
                  padding: "1.2rem 0.7rem",
                  boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.07)",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "800",
                    color: "#1e3a8a",
                    margin: "0 0 0.3rem 0",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontSize: "1.15rem",
                    color: "#1d4ed8",
                    margin: 0,
                  }}
                >
                  {p.age}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: "0.7rem 2.5rem 0.2rem 2.5rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: "1.2rem",
              alignItems: "center",
            }}
          >
            {/* Left Column: Bullet List */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
                fontSize: "1.25rem",
              }}
            >
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.3rem",
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                }}
              >
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#1e40af",
                  }}
                >
                  <CheckCircle
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      color: "#16a34a",
                      marginRight: "0.7rem",
                      flexShrink: 0,
                    }}
                  />
                  Secure, Caring Environment
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#1e40af",
                  }}
                >
                  <CheckCircle
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      color: "#16a34a",
                      marginRight: "0.7rem",
                      flexShrink: 0,
                    }}
                  />
                  Trained, Caring Teachers
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#1e40af",
                  }}
                >
                  <CheckCircle
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      color: "#16a34a",
                      marginRight: "0.7rem",
                      flexShrink: 0,
                    }}
                  />
                  Low Class Size
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#1e40af",
                  }}
                >
                  <CheckCircle
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      color: "#16a34a",
                      marginRight: "0.7rem",
                      flexShrink: 0,
                    }}
                  />
                  Tours and Enrichment Programs
                </li>
              </ul>
            </div>

            {/* Right Column: School Info */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {org.logo && (
                <Image
                  src={org.logo}
                  alt="School Logo"
                  style={{
                    height: "4rem",
                    marginBottom: "0.1rem",
                    objectFit: "contain",
                  }}
                />
              )}
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#1e3a8a",
                  margin: 0,
                }}
              >
                {org.name}
              </h1>
              <div
                style={{
                  color: "#1e3a8a",
                  fontSize: "1.2rem",
                  fontWeight: "500",
                  marginTop: "0.2rem",
                }}
              >
                "Inspiring Everyday"
              </div>
            </div>
          </div>
        </div>

        {/* Row 5: Footer - Absolute positioned at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            {/* WhatsApp Block */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                backgroundColor: "#1e3a8a",
                padding: "2rem 1.5rem",
                borderTopRightRadius: "2.2rem",
                gap: "0.5rem",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
              }}
            >
              <div
                style={{
                  marginBottom: "0.7rem",
                  color: "white",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                }}
              >
                Message Us
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SiWhatsapp
                  style={{
                    width: "2rem",
                    height: "2rem",
                    color: "white",
                    marginRight: "0.5rem",
                  }}
                />
                <span
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "1.3rem",
                  }}
                >
                  +592 627 1915
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SiWhatsapp
                  style={{
                    width: "2rem",
                    height: "2rem",
                    color: "white",
                    marginRight: "0.5rem",
                  }}
                />
                <span
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "1.3rem",
                  }}
                >
                  +592 751 3788
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SiWhatsapp
                  style={{
                    width: "2rem",
                    height: "2rem",
                    color: "white",
                    marginRight: "0.5rem",
                  }}
                />
                <span
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "1.3rem",
                  }}
                >
                  +592 646 4069
                </span>
              </div>
            </div>

            {/* Center CTA + Address Dome */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                textAlign: "center",
                position: "relative",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  borderTopLeftRadius: "50%",
                  borderTopRightRadius: "50%",
                  paddingTop: "1.2rem",
                  paddingBottom: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#991b1b",
                    color: "white",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    borderRadius: "9999px",
                    padding: "0.5rem 1.1rem",
                    marginBottom: "2rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                  }}
                >
                  <RocketIcon style={{ width: "1.5rem", height: "1.5rem" }} />{" "}
                  Register Now!
                </div>
                <div
                  style={{
                    color: "#1e3a8a",
                    fontSize: "1.5rem",
                    fontWeight: "500",
                  }}
                >
                  Lot 11, Public Road
                  <br />
                  Mon Repos, ECD
                  <br />
                  <span
                    style={{
                      color: "#60a5fa",
                      fontSize: "1.4rem",
                      fontWeight: "400",
                      fontStyle: "italic",
                    }}
                  >
                    (Opposite GBTI Bank)
                  </span>
                </div>
              </div>
            </div>

            {/* Website Block */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                backgroundColor: "#1e3a8a",
                padding: "2rem 1.5rem",
                borderTopLeftRadius: "2.2rem",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
              }}
            >
              <div style={{ marginBottom: "0.7rem" }}>
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "0.7rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.5rem",
                  }}
                >
                  <QRCode value="https://ma.edu.gy/programs?r=ef" size={160} />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "0.5rem",
                }}
              >
                <Globe
                  style={{
                    width: "2rem",
                    height: "2rem",
                    color: "white",
                    marginRight: "0.5rem",
                  }}
                />
                <span
                  style={{
                    color: "white",
                    fontWeight: "800",
                    fontSize: "1.5rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  ma.edu.gy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
