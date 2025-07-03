import { Image } from "@sovoli/ui/components/image";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { Globe } from "lucide-react";
import type { OrgInstance } from "~/modules/organisations/types";
import QRCode from "react-qr-code";

export interface EnrollmentFlierProps {
  orgInstance: OrgInstance;
}

export function EnrollmentFlier({ orgInstance }: EnrollmentFlierProps) {
  const { org, academicModule } = orgInstance;

  const currentCycle = academicModule?.programCycles?.[0];

  return (
    <div className="absolute inset-0 w-full h-full bg-white overflow-hidden font-sans">
      {/* Zone A: Header */}
      <div
        className="absolute top-0 left-0 right-0 flex flex-col items-center text-center px-8"
        style={{ height: 140 }}
      >
        {org.logo && (
          <Image
            src={org.logo}
            alt="School Logo"
            className="h-16 mb-2 object-contain"
          />
        )}
        <h1 className="text-4xl font-bold text-blue-900">{org.name}</h1>
        <div className="bg-blue-100 text-blue-900 px-6 py-2 rounded-full text-lg font-medium mt-2">
          Applications Now Open –{" "}
          {currentCycle?.academicCycle.customLabel ?? "September 2025"}
        </div>
      </div>

      {/* Zone B: Hero Image */}
      <div
        className="absolute left-0 right-0"
        style={{ top: 140, height: 180 }}
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url("/orgs/private-schools/guyana/modernacademy/programs/pre-nursery.webp")`,
          }}
        />
      </div>

      {/* Zone C: Program List */}
      <div className="absolute left-8 right-8" style={{ top: 330 }}>
        <div className="grid grid-cols-4 gap-4 text-center">
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
              className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm"
            >
              <h3 className="text-xl font-bold text-blue-900 mb-1">
                {p.title}
              </h3>
              <p className="text-sm text-blue-700">{p.age}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Zone E: CTA Footer */}
      <div
        className="absolute left-0 right-0 flex justify-between items-end"
        style={{ bottom: 0 }}
      >
        {/* WhatsApp */}
        <div className="flex-1 flex flex-col items-center text-center bg-blue-900 p-4 rounded-tr-xl">
          <div className="mb-2 flex items-center justify-center">
            <div className="w-36 h-36 bg-white rounded-lg flex items-center justify-center p-2">
              <QRCode value="wa.me/5926271915" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <SiWhatsapp className="w-5 h-5 text-white mr-2" />
            <span className="text-white font-semibold text-lg">
              +592 627-1915
            </span>
          </div>
        </div>
        {/* Location */}
        <div className="flex-1 flex flex-col items-center text-center bg-blue-900 pb-4">
          <div className="bg-white rounded-b-full pb-8 w-full" />
          <div className="text-white text-xl leading-tight pt-4">
            Lot 11, Public Road
            <br />
            Mon Repos, ECD
            <br />
            <span className="text-blue-200 text-lg">
              (Opposite Medicare Pharmacy)
            </span>
          </div>
        </div>
        {/* Website */}
        <div className="flex-1 flex flex-col items-center text-center bg-blue-900 p-4 rounded-tl-xl">
          <div className="mb-2 flex items-center justify-center">
            <div className="w-36 h-36 bg-white rounded-lg flex items-center justify-center p-2">
              <QRCode value="ma.edu.gy/programs?r=ef" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Globe className="w-5 h-5 text-white mr-2" />
            <span className="text-white font-semibold text-lg">ma.edu.gy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
