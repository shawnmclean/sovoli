import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Input, Textarea } from "@sovoli/ui/components/input";

export default function ApplyPage() {
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-center text-3xl font-bold">
          Apply to Our School
        </h2>
        <form className="space-y-4">
          <Card className="p-4">
            <CardBody>
              <label className="mb-2 block font-semibold">Student Name</label>
              <Input
                type="text"
                placeholder="Enter student's full name"
                className="w-full"
              />
            </CardBody>
          </Card>

          <Card className="p-4">
            <CardBody>
              <label className="mb-2 block font-semibold">
                Parent/Guardian Name
              </label>
              <Input
                type="text"
                placeholder="Enter parent/guardian's name"
                className="w-full"
              />
            </CardBody>
          </Card>

          <Card className="p-4">
            <CardBody>
              <label className="mb-2 block font-semibold">
                Contact Information
              </label>
              <Input
                type="email"
                placeholder="Enter email"
                className="mb-2 w-full"
              />
              <Input
                type="tel"
                placeholder="Enter phone number"
                className="w-full"
              />
            </CardBody>
          </Card>

          <Card className="p-4">
            <CardBody>
              <label className="mb-2 block font-semibold">
                Student Information
              </label>
              <Textarea
                placeholder="Briefly describe the student (age, grade level, etc.)"
                className="w-full"
              />
            </CardBody>
          </Card>

          <div className="text-center">
            <Button type="submit" className="bg-primary px-6 py-2 text-white">
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
