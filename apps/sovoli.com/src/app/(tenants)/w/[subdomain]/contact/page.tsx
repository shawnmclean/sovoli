import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Input, Textarea } from "@sovoli/ui/components/input";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

export default function ContactUsPage() {
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-center text-3xl font-bold">Contact Us</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="p-6">
            <CardBody>
              <h3 className="mb-4 text-xl font-semibold">Get in Touch</h3>
              <p className="mb-6 text-default-600">
                Feel free to reach out to us through the contact form below or
                using our contact details.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPinIcon className="h-5 w-5 text-primary" />
                  <p className="text-sm">123 Main Street, Georgetown, Guyana</p>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="h-5 w-5 text-primary" />
                  <p className="text-sm">+592-123-4567</p>
                </div>
                <div className="flex items-center gap-3">
                  <MailIcon className="h-5 w-5 text-primary" />
                  <p className="text-sm">info@modernacademy.gy</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="p-6">
            <CardBody>
              <h3 className="mb-4 text-xl font-semibold">Send Us a Message</h3>
              <form className="space-y-4">
                <Input type="text" placeholder="Your Name" className="w-full" />
                <Input
                  type="email"
                  placeholder="Your Email"
                  className="w-full"
                />
                <Textarea
                  placeholder="Your Message"
                  className="w-full"
                  rows={5}
                />
                <Button
                  type="submit"
                  className="bg-primary px-6 py-2 text-white"
                >
                  Send Message
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}
