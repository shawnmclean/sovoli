import type { OrgInstance } from "~/modules/organisations/types";

export interface EnrollmentFlierProps {
  orgInstance: OrgInstance;
}

export function EnrollmentFlier({ orgInstance }: EnrollmentFlierProps) {
  const { org, academicModule } = orgInstance;

  // Get primary location
  const primaryLocation =
    org.locations.find((loc) => loc.isPrimary) ?? org.locations[0];

  // Get primary contact (WhatsApp preferred, then phone, then email)
  const primaryContact =
    primaryLocation?.contacts.find((c) => c.type === "whatsapp") ??
    primaryLocation?.contacts.find((c) => c.type === "phone") ??
    primaryLocation?.contacts.find((c) => c.type === "email");

  // Get internal CRM contact if available
  const crmContact =
    org.internalCRM?.people[0]?.contacts.find((c) => c.type === "whatsapp") ??
    org.internalCRM?.people[0]?.contacts.find((c) => c.type === "phone");

  const contactToUse = crmContact ?? primaryContact;

  // Get current program cycle (assuming we want to show the first available)
  const currentProgramCycle = academicModule?.programCycles?.[0];

  return (
    <div className="absolute inset-0 w-full h-full bg-white">
      {/* Header Section - positioned absolutely */}
      <div
        className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center px-8"
        style={{ height: 140 }}
      >
        <h1 className="text-5xl font-extrabold text-blue-900 mb-2 text-center leading-tight">
          {org.name}
        </h1>
        <div className="bg-blue-100 text-blue-900 px-6 py-2 rounded-full text-xl font-medium mb-2 text-center">
          Now Enrolling for{" "}
          {currentProgramCycle?.academicCycle.customLabel ?? "Term 1, 2025"}
        </div>
        <p className="text-lg text-blue-800 opacity-90 font-normal text-center">
          A safe, nurturing environment for your child's early years
        </p>
      </div>

      {/* Contact/Info Row - positioned absolutely */}
      <div
        className="absolute left-8 right-8 flex flex-row justify-between items-stretch gap-6"
        style={{ top: 150, height: 130 }}
      >
        {/* WhatsApp Card */}
        <div className="flex-1 bg-white rounded-2xl border-2 border-blue-200 flex flex-col items-center justify-center px-4 py-3 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center text-blue-700 text-xs mb-2">
            [QR: WhatsApp]
          </div>
          <div className="text-blue-800 font-bold text-lg mb-1">Message Us</div>
          <div className="text-blue-700 text-sm mb-1">WhatsApp</div>
          <div className="text-blue-900 font-medium text-base">
            {contactToUse?.value ?? "+592 622-9382"}
          </div>
        </div>
        {/* Visit Us Card */}
        <div className="flex-1 bg-white rounded-2xl border-2 border-blue-200 flex flex-col items-center justify-center px-4 py-3 shadow-sm">
          <div className="text-2xl mb-1">📍</div>
          <div className="text-blue-800 font-bold text-lg mb-1">Visit Us</div>
          <div className="text-blue-900 text-base mb-1 text-center">
            {primaryLocation?.address.line1 ?? "112 Regent Street"}
            <br />
            {primaryLocation?.address.city ?? "Georgetown"}
          </div>
          <div className="italic text-blue-500 text-xs text-center">
            Opposite Medicare Pharmacy
          </div>
        </div>
        {/* Website Card */}
        <div className="flex-1 bg-white rounded-2xl border-2 border-blue-200 flex flex-col items-center justify-center px-4 py-3 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center text-blue-700 text-xs mb-2">
            [QR: Website]
          </div>
          <div className="text-blue-800 font-bold text-lg mb-1">
            Visit Website
          </div>
          <div className="text-blue-700 text-sm mb-1">Online Info</div>
          <div className="text-blue-900 font-medium text-base truncate max-w-[120px]">
            {org.username}.sovoli.com
          </div>
        </div>
      </div>

      {/* Program Information Section - positioned absolutely */}
      <div
        className="absolute left-8 right-8 flex flex-col gap-4"
        style={{ top: 300 }}
      >
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-4">
          Our Programs
        </h2>

        {/* Programs Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Nursery Program */}
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-blue-900 mb-2">Nursery</h3>
            <p className="text-blue-800 text-sm mb-2">
              Ages 3-4 years • Early learning foundation
            </p>
            <div className="text-blue-700 font-semibold">$150/month</div>
          </div>

          {/* Pre-Nursery Program */}
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-blue-900 mb-2">
              Pre-Nursery
            </h3>
            <p className="text-blue-800 text-sm mb-2">
              Ages 2-3 years • Play-based learning
            </p>
            <div className="text-blue-700 font-semibold">$120/month</div>
          </div>
        </div>
      </div>

      {/* Footer Section - positioned absolutely at bottom */}
      <div
        className="absolute bottom-8 left-8 right-8 text-center"
        style={{ height: 80 }}
      >
        <div className="bg-blue-100 rounded-xl p-4 border-2 border-blue-200">
          <p className="text-blue-900 font-semibold text-lg mb-1">
            Limited Spaces Available
          </p>
          <p className="text-blue-700 text-sm">
            Contact us today to secure your child's place
          </p>
        </div>
      </div>
    </div>
  );
}
