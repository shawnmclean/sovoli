import { Image } from "@sovoli/ui/components/image";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { Globe, RocketIcon, Bell } from "lucide-react";
import type { OrgInstance } from "~/modules/organisations/types";
import QRCode from "react-qr-code";

export interface EnrollmentFlierProps {
  orgInstance: OrgInstance;
}

export function EnrollmentFlier({ orgInstance }: EnrollmentFlierProps) {
  const { org } = orgInstance;

  return (
    <div className="w-full h-full bg-white font-sans flex flex-col">
      {/* Row 1: Header */}
      <div className="flex flex-col items-center text-center p-8 bg-blue-900">
        <div className="bg-white rounded-full px-8 py-4">
          <h1 className="text-4xl font-bold text-blue-900 flex items-center gap-3">
            <Bell className="w-12 h-12" />
            SEPTEMBER APPLICATIONS OPEN
          </h1>
        </div>
      </div>

      {/* Row 2: Hero Image */}
      <div className="px-8 py-6 flex justify-center">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 rounded-2xl p-3 w-full">
          <Image
            src="/orgs/private-schools/guyana/modernacademy/programs/pre-nursery.webp"
            alt="School Programs"
            width={800}
            height={240}
            className="w-full h-60 object-cover object-top rounded-xl"
          />
        </div>
      </div>

      {/* Row 3: Logo and School Info - Two Columns */}
      <div className="px-16 py-4">
        <div className="grid grid-cols-2 gap-8 items-center">
          {/* Left Column: Bullet List */}
          <div className="space-y-3 text-xl">
            <ul className="space-y-2">
              <li className="flex items-center text-blue-800">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Safe Environment
              </li>
              <li className="flex items-center text-blue-800">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Experienced Teachers
              </li>
              <li className="flex items-center text-blue-800">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Low Class Size
              </li>
              <li className="flex items-center text-blue-800">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Tours / Culture
              </li>
            </ul>
          </div>

          {/* Right Column: School Info */}
          <div className="flex flex-col items-center text-center">
            {org.logo && (
              <Image
                src={org.logo}
                alt="School Logo"
                className="h-16 mb-2 object-contain"
              />
            )}
            <h1 className="text-4xl font-bold text-blue-900">{org.name}</h1>
            <div className="text-blue-900 text-xl font-medium mt-2">
              "Inspiring Everyday"
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Program List */}
      <div className="px-8 py-6">
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

      {/* Row 5: Footer - Push to bottom */}
      <div className="mt-auto">
        <div className="flex justify-between items-end">
          {/* WhatsApp Block */}
          <div className="flex-1 flex flex-col items-center text-center bg-blue-900 px-4 py-6 rounded-tr-[48px]">
            <div className="mb-3">
              <div className="w-36 h-36 bg-white rounded-xl flex items-center justify-center p-2">
                <QRCode value="https://wa.me/5926271915" />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <SiWhatsapp className="w-5 h-5 text-white mr-2" />
              <span className="text-white font-semibold text-lg">
                +592 627-1915
              </span>
            </div>
          </div>

          {/* Center CTA + Address Dome */}
          <div className="flex-1 flex flex-col items-center justify-end text-center relative z-10">
            <div className="w-full bg-white rounded-t-full pt-4 pb-6 flex flex-col items-center justify-center shadow-sm">
              <div className="bg-red-800 text-white text-xl font-bold rounded-full px-6 py-3 mb-6 shadow-md flex items-center gap-2">
                <RocketIcon className="w-6 h-6" /> Register Now!
              </div>
              <div className="text-blue-900 text-xl leading-tight font-medium">
                Lot 11, Public Road
                <br />
                Mon Repos, ECD
                <br />
                <span className="text-blue-400 text-lg font-normal italic">
                  (Opposite Medicare Pharmacy)
                </span>
              </div>
            </div>
          </div>

          {/* Website Block */}
          <div className="flex-1 flex flex-col items-center text-center bg-blue-900 px-4 py-6 rounded-tl-[48px]">
            <div className="mb-3">
              <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center p-2">
                <QRCode value="https://ma.edu.gy/programs?r=ef" />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Globe className="w-6 h-6 text-white mr-2" />
              <span className="text-white font-bold text-xl">ma.edu.gy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
