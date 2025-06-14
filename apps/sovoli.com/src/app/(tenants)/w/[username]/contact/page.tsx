import { notFound } from "next/navigation";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Input, Textarea } from "@sovoli/ui/components/input";

import { ContactMethods } from "../components/ContactMethods";
import { getOrgInstanceByUsername } from "../lib/getOrgInstanceByUsername";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface ContactUsPageProps {
  params: Promise<{ username: string }>;
}

export default async function ContactUsPage({
  params,
}: ContactUsPageProps) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);
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
              <ContactMethods orgInstance={orgInstance} />
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
                  isDisabled
                />
                <Textarea
                  placeholder="Your Message"
                  className="w-full"
                  rows={5}
                  isDisabled
                />
                <Button
                  type="submit"
                  className="bg-primary px-6 py-2 text-white"
                  isDisabled
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
