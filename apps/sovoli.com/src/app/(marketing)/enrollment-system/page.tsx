import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import {
  SearchIcon,
  LinkIcon,
  BarChart3Icon,
  TargetIcon,
  UsersIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  MessageCircleIcon,
} from "lucide-react";

export const metadata = {
  title: "Grow Your School With the Sovoli Growth System – Sovoli",
  description:
    "A complete digital visibility and lead system built for small private schools in Guyana. Get your school scored and see how Modern Academy grew their enrollment.",
};

export default function EnrollmentSystemPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-default-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-4">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Grow Your School With the Sovoli Growth System
            </span>
          </h1>
          <p className="text-xl text-default-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            A complete digital visibility and lead system built for small
            private schools in Guyana. Turn parent searches into enrollment
            conversations automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              color="primary"
              endContent={<ArrowRightIcon className="h-5 w-5" />}
              className="min-w-[200px]"
            >
              See How It Works
            </Button>
            <WhatsAppLink
              intent="Contact"
              role="admin"
              page="landing"
              funnel="enrollment-system"
              message="Hi! I'm interested in the Sovoli Growth System for my school. Can you tell me more?"
            >
              <Button
                size="lg"
                variant="bordered"
                color="success"
                endContent={<MessageCircleIcon className="h-5 w-5" />}
                className="min-w-[200px]"
              >
                Message on WhatsApp
              </Button>
            </WhatsAppLink>
          </div>
        </div>
      </section>

      {/* Proof Section */}
      <section className="py-16 px-4 bg-default-50">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-success-100 text-success-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <CheckCircleIcon className="h-4 w-4" />
              Already live in Guyana
            </div>
            <h2 className="text-3xl font-bold mb-4">See It In Action</h2>
            <p className="text-lg text-default-600 mb-8">
              Modern Academy is already using the Sovoli Growth System to
              connect with parents and grow their enrollment.
            </p>
          </div>

          <div className="bg-background rounded-xl shadow-lg overflow-hidden border border-default-200">
            <div className="aspect-video bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UsersIcon className="h-8 w-8 text-background" />
                </div>
                <h3 className="text-xl font-semibold text-default-800 mb-2">
                  Modern Academy
                </h3>
                <p className="text-default-600">
                  Live school website with integrated WhatsApp chat
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              How The Sovoli Growth System Works
            </h2>
            <p className="text-lg text-default-600 max-w-2xl mx-auto">
              Five simple steps that turn parent searches into enrollment
              conversations, while you focus on what matters most: your
              students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <SearchIcon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold">
                  Parents are already searching
                </h3>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-default-600">
                  Every day, parents search Google for schools in your area. The
                  Sovoli system ensures your school appears when they're
                  looking.
                </p>
              </CardBody>
            </Card>

            {/* Card 2 */}
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
                  <LinkIcon className="h-6 w-6 text-success-600" />
                </div>
                <h3 className="text-xl font-semibold">
                  Sovoli connects your school
                </h3>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-default-600">
                  We create a mobile-optimized website for your school with
                  integrated WhatsApp chat that parents can use instantly.
                </p>
              </CardBody>
            </Card>

            {/* Card 3 */}
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3Icon className="h-6 w-6 text-secondary-600" />
                </div>
                <h3 className="text-xl font-semibold">
                  Your Digital Readiness Score
                </h3>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-default-600">
                  Get a clear score showing how ready your school is for digital
                  growth across website, social media, and online presence.
                </p>
              </CardBody>
            </Card>

            {/* Card 4 */}
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mb-4">
                  <TargetIcon className="h-6 w-6 text-warning-600" />
                </div>
                <h3 className="text-xl font-semibold">Smart Ad Tracking</h3>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-default-600">
                  Facebook CAPI integration makes your ads cheaper and more
                  effective by tracking real parent actions, not just clicks.
                </p>
              </CardBody>
            </Card>

            {/* Card 5 */}
            <Card className="h-full md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <UsersIcon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold">You focus on students</h3>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-default-600">
                  While the system handles lead generation and parent
                  communication, you and your team focus on teaching and student
                  success.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="mx-auto max-w-4xl text-center">
          <div className="bg-background rounded-xl shadow-lg p-8 border border-default-200">
            <div className="w-16 h-16 bg-success-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="h-8 w-8 text-background" />
            </div>
            <blockquote className="text-xl font-medium text-default-800 mb-4">
              "Modern Academy now appears on Google and receives parent
              inquiries weekly. The WhatsApp integration makes it so easy for
              parents to reach us."
            </blockquote>
            <cite className="text-default-600 font-medium">
              — Modern Academy Administration Team
            </cite>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-8 text-background">
            <h2 className="text-3xl font-bold mb-4">
              We're partnering with a few schools this term
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get your Digital Readiness Score and preview your school's new
              website. Limited spots available for the current term.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                variant="solid"
                color="secondary"
                className="min-w-[200px] text-primary-600 font-semibold"
                endContent={<ArrowRightIcon className="h-5 w-5" />}
              >
                Get My School Scored
              </Button>
              <WhatsAppLink
                intent="Contact"
                role="admin"
                page="landing"
                funnel="enrollment-system-cta"
                message="Hi! I'd like to get my school scored and see a preview of the new website. When can we schedule a call?"
              >
                <Button
                  size="lg"
                  variant="bordered"
                  className="min-w-[200px] border-background text-background hover:bg-background hover:text-primary-600"
                  endContent={<MessageCircleIcon className="h-5 w-5" />}
                >
                  Message on WhatsApp
                </Button>
              </WhatsAppLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
