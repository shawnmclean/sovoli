import type { OrgInstance } from "~/modules/organisations/types";
import { Image } from "@sovoli/ui/components/image";

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
  const program = currentProgramCycle?.orgProgram;

  // Format dates
  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return "TBD";
    try {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      const start = startDateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const end = endDateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return `${start} – ${end}`;
    } catch {
      return `${startDate} – ${endDate}`;
    }
  };

  return (
    <div className="w-[794px] h-[1123px] bg-white border-3 border-blue-800 rounded-xl shadow-lg mx-auto relative overflow-hidden print:w-[8.5in] print:h-[11in] print:shadow-none print:rounded-none print:border-0">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-800 to-blue-600 p-8 text-center text-white relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="10" r="1" fill="currentColor" />
            <circle cx="90" cy="20" r="1.5" fill="currentColor" />
            <circle cx="30" cy="80" r="1" fill="currentColor" />
            <circle cx="70" cy="70" r="1.2" fill="currentColor" />
          </svg>
        </div>

        <h1 className="text-5xl font-extrabold mb-2 text-shadow-lg relative z-10">
          {org.name}
        </h1>
        <div className="bg-white/15 px-5 py-2 rounded-full inline-block text-xl font-medium mb-2 relative z-10">
          Now Enrolling for{" "}
          {currentProgramCycle?.academicCycle.customLabel ?? "Term 1, 2025"}
        </div>
        <p className="text-lg opacity-90 font-normal relative z-10">
          A safe, nurturing environment for your child's early years
        </p>
      </div>

      <div className="p-8">
        {/* Main Image Card */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
          <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center text-slate-600 text-lg font-medium border-2 border-dashed border-slate-400">
            {program?.image ? (
              <Image
                src={program.image}
                alt={`${program.name} program`}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              "[Classroom Image Placeholder]"
            )}
          </div>
        </div>

        {/* Program Details Card */}
        {program && (
          <div className="bg-white border-2 border-blue-800 rounded-xl p-6 mb-6 shadow-md relative">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-800 to-blue-500 rounded-t-xl"></div>

            <h2 className="text-3xl font-bold text-blue-800 mb-4 flex items-center gap-3">
              <span className="text-2xl">🎓</span>
              {program.name ?? "Nursery Program"}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-100 p-3 rounded-lg border-l-4 border-blue-800">
                <strong className="text-blue-800 font-semibold block mb-1">
                  📅 Term Dates
                </strong>
                <span className="text-slate-600 text-sm">
                  {formatDateRange(
                    currentProgramCycle.academicCycle.startDate,
                    currentProgramCycle.academicCycle.endDate,
                  )}
                </span>
              </div>

              <div className="bg-slate-100 p-3 rounded-lg border-l-4 border-blue-800">
                <strong className="text-blue-800 font-semibold block mb-1">
                  👶 Age Group
                </strong>
                <span className="text-slate-600 text-sm">
                  {currentProgramCycle.computedRequirements.find(
                    (req) => req.type === "age",
                  )?.description ?? "3–5 years"}
                </span>
              </div>

              <div className="bg-slate-100 p-3 rounded-lg border-l-4 border-blue-800">
                <strong className="text-blue-800 font-semibold block mb-1">
                  💰 Tuition
                </strong>
                <span className="text-slate-600 text-sm">
                  {currentProgramCycle.feeStructure?.tuitionFee.GYD
                    ? `GYD $${currentProgramCycle.feeStructure.tuitionFee.GYD.toLocaleString()} / term`
                    : "Contact for pricing"}
                </span>
              </div>

              <div className="bg-slate-100 p-3 rounded-lg border-l-4 border-blue-800">
                <strong className="text-blue-800 font-semibold block mb-1">
                  ⏰ Class Hours
                </strong>
                <span className="text-slate-600 text-sm">
                  8:00 AM - 3:00 PM
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white p-3 rounded-lg font-semibold text-center shadow-md">
              ✔️ Limited spots available — secure your child's seat now!
            </div>
          </div>
        )}

        {/* Call to Action Card */}
        <div className="bg-gradient-to-br from-blue-800 to-blue-500 text-white p-6 rounded-xl text-center mb-6 shadow-lg">
          <p className="text-2xl font-bold mb-2">📲 Ready to Enroll?</p>
          <p className="text-lg opacity-90">
            Scan a QR code below to chat or explore programs
          </p>
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          {/* WhatsApp Card */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 text-center shadow-sm hover:border-blue-800 hover:shadow-md transition-all">
            <div className="w-24 h-24 bg-slate-100 mx-auto mb-3 rounded-lg flex items-center justify-center text-slate-600 text-xs text-center leading-tight border-2 border-dashed border-slate-300">
              [QR: WhatsApp]
            </div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Message Us
            </h3>
            <p className="text-sm text-slate-600 mb-1">WhatsApp</p>
            <p className="text-blue-800 font-medium">
              {contactToUse?.value ?? "+592 627 1915"}
            </p>
          </div>

          {/* Location Card */}
          <div className="bg-slate-50 border-2 border-blue-800 rounded-xl p-5 text-center">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">
              📍 Visit Us
            </h3>
            {primaryLocation?.address && (
              <>
                <p className="text-slate-700 mb-1">
                  {primaryLocation.address.line1}
                </p>
                <p className="text-slate-700 mb-1">
                  {primaryLocation.address.city}
                </p>
                <p className="text-slate-500 italic text-sm mt-2">
                  Opposite Medicare Pharmacy
                </p>
              </>
            )}
          </div>

          {/* Website Card */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-5 text-center shadow-sm hover:border-blue-800 hover:shadow-md transition-all">
            <div className="w-24 h-24 bg-slate-100 mx-auto mb-3 rounded-lg flex items-center justify-center text-slate-600 text-xs text-center leading-tight border-2 border-dashed border-slate-300">
              [QR: Website]
            </div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Visit Website
            </h3>
            <p className="text-sm text-slate-600 mb-1">Online Info</p>
            <p className="text-blue-800 font-medium">
              {org.username}.sovoli.com
            </p>
          </div>
        </div>

        {/* Footer Card */}
        <div className="bg-blue-800 text-white p-4 rounded-lg text-center text-sm font-medium">
          {org.isVerified
            ? "✅ Verified Private School on Sovoli.com"
            : "Private School on Sovoli.com"}
        </div>
      </div>
    </div>
  );
}
