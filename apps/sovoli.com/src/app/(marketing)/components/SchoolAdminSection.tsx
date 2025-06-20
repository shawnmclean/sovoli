import { WhatsAppButton } from "~/components/WhatsAppButton";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";

export function SchoolAdminSection() {
  return (
    <section className="z-20 w-full max-w-screen-lg mt-12">
      {/* Headline */}
      <h2 className="text-2xl font-bold leading-tight tracking-tight mb-4">
        Are You a School Administrator?
      </h2>

      {/* Description */}
      <p className="text-base text-default-600 mb-6 max-w-2xl">
        Get your school listed on Sovoli and reach more parents in Guyana. We
        help schools showcase their programs, facilities, and achievements to
        families looking for quality education.
      </p>

      {/* CTA Button */}
      <div className="flex justify-center">
        <WhatsAppButton
          phoneNumber="+5926082743"
          message="Hello, I'm a school administrator and would like to list my school on Sovoli."
        >
          <SiWhatsapp className="mr-2" />
          Get Your School Listed
        </WhatsAppButton>
      </div>
    </section>
  );
}
