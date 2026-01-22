import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { Image } from "@sovoli/ui/components/image";
import { Bell, CheckCircle, Globe, RocketIcon } from "lucide-react";
import type { OrgInstance } from "~/modules/organisations/types";

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
            padding: "3rem",
            backgroundColor: "#1e3a8a",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "9999px",
              padding: "1rem 3rem",
            }}
          >
            <h1
              style={{
                fontSize: "4.5rem",
                fontWeight: "700",
                color: "#1e3a8a",
                display: "flex",
                alignItems: "center",
                gap: "1.2rem",
                margin: 0,
              }}
            >
              <Bell
                style={{
                  width: "5rem",
                  height: "5rem",
                  flexShrink: 0,
                  color: "#fbbf24",
                  filter:
                    "drop-shadow(0 0 16px #fbbf24) drop-shadow(0 0 8px #f59e42)",
                }}
              />
              SEPTEMBER APPLICATIONS OPEN
            </h1>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#fef08a",
            color: "#1e3a8a",
            padding: "1.2rem 2rem",
            borderRadius: "1rem",
            fontSize: "2rem",
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          💡 Get fee breakdowns & enrollment discounts at <u>ma.edu.gy</u>
        </div>

        {/* Row 2: Hero Image */}
        <div
          style={{
            marginTop: "1rem",
            padding: "2rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(to right, #1e3a8a, #1e40af, #7c3aed)",
              borderRadius: "1.5rem",
              padding: "1rem",
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
                right: "-2rem",
                zIndex: 50,
              }}
            >
              <div
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  padding: "0.6rem 2rem",
                  borderRadius: "1rem",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  transform: "rotate(12deg)",
                  fontWeight: "700",
                  fontSize: "2.2rem",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              >
                Limited Space Available!
              </div>
            </div>
            <Image
              src="/private-schools/guyana/modernacademy/programs/pre-nursery.webp"
              alt="School Programs"
              width={1350}
              height={400}
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                objectPosition: "top",
                borderRadius: "1rem",
              }}
            />
          </div>
        </div>

        <div
          style={{
            padding: "1rem 3rem 1.5rem 3rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "2.2rem",
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
                  border: "3px solid #bfdbfe",
                  borderRadius: "2rem",
                  padding: "2.2rem 1.2rem",
                  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.1)",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              >
                <h3
                  style={{
                    fontSize: "2.8rem",
                    fontWeight: "800",
                    color: "#1e3a8a",
                    margin: "0 0 0.7rem 0",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontSize: "1.7rem",
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
            padding: "2.5rem 5rem 0.7rem 5rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: "2.2rem",
              alignItems: "center",
            }}
          >
            {/* Left Column: Bullet List */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
                fontSize: "2.5rem",
              }}
            >
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.7rem",
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
                      width: "3rem",
                      height: "3rem",
                      color: "#16a34a",
                      marginRight: "1.2rem",
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
                      width: "3rem",
                      height: "3rem",
                      color: "#16a34a",
                      marginRight: "1.2rem",
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
                      width: "3rem",
                      height: "3rem",
                      color: "#16a34a",
                      marginRight: "1.2rem",
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
                      width: "3rem",
                      height: "3rem",
                      color: "#16a34a",
                      marginRight: "1.2rem",
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
              {org.logoPhoto?.url && (
                <Image
                  src={org.logoPhoto.url}
                  alt="School Logo"
                  style={{
                    height: "7rem",
                    marginBottom: "0.3rem",
                    objectFit: "contain",
                  }}
                />
              )}
              <h1
                style={{
                  fontSize: "3.5rem",
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
                  fontSize: "2.5rem",
                  fontWeight: "500",
                  marginTop: "0.4rem",
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
              alignItems: "stretch",
              gap: "2rem",
            }}
          >
            {/* Left Section: Contact + Website */}
            <div
              style={{
                flex: 2,
                display: "flex",
                gap: "1rem",
                backgroundColor: "#1e3a8a",
                borderTopRightRadius: "3.2rem",
              }}
            >
              {/* WhatsApp */}
              <div
                style={{
                  flex: 1,
                  padding: "3.5rem 2.5rem",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "1.2rem",
                }}
              >
                <div style={{ fontSize: "2.5rem", fontWeight: "700" }}>
                  Message Us
                </div>

                {["+592 627 1915", "+592 751 3788", "+592 646 4069"].map(
                  (num, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2rem",
                        fontWeight: "600",
                      }}
                    >
                      <SiWhatsapp
                        style={{
                          width: "2.7rem",
                          height: "2.7rem",
                          color: "white",
                          marginRight: "0.7rem",
                        }}
                      />
                      {num}
                    </div>
                  ),
                )}
              </div>

              {/* Website */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#2563eb", // brighter blue than #1e3a8a
                  padding: "3.5rem 2.5rem",
                  borderTopLeftRadius: "3.2rem",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  gap: "1.2rem",
                  boxShadow: "0 0 25px rgba(0, 123, 255, 0.4)",
                }}
              >
                <div
                  style={{
                    fontSize: "2.8rem",
                    fontWeight: "800",
                    letterSpacing: "0.01em",
                    marginBottom: "1rem",
                    color: "#ffffff",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                  }}
                >
                  View Pricing & Discounts
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "2.2rem",
                    fontWeight: "800",
                    backgroundColor: "#ffffff",
                    color: "#1e3a8a",
                    padding: "1rem 2.2rem",
                    borderRadius: "9999px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  }}
                >
                  <Globe
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      color: "#1e3a8a",
                      marginRight: "0.8rem",
                    }}
                  />
                  ma.edu.gy
                </div>
              </div>
            </div>

            {/* Right Section: Register + Address */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
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
                  paddingTop: "2.2rem",
                  paddingBottom: "2.5rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    color: "#1e3a8a",
                    fontSize: "2.2rem",
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
                      fontSize: "2rem",
                      fontWeight: "400",
                      fontStyle: "italic",
                    }}
                  >
                    (Opposite GBTI Bank)
                  </span>
                </div>
                <div
                  style={{
                    backgroundColor: "#991b1b",
                    color: "white",
                    fontSize: "3rem",
                    fontWeight: "700",
                    borderRadius: "9999px",
                    padding: "1rem 2.2rem",
                    marginTop: "2.5rem",
                    boxShadow: "0 6px 10px -1px rgba(0, 0, 0, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <RocketIcon style={{ width: "3rem", height: "3rem" }} />
                  Register Now!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
