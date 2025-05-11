import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Image } from "@sovoli/ui/components/image";

export function ProgramsSection() {
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-bold">Our Programs</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Elementary Education",
              image: "https://img.heroui.chat/image/places?w=600&h=400&u=2",
              description:
                "Strong foundational learning in a nurturing environment",
            },
            {
              title: "Middle School",
              image: "https://img.heroui.chat/image/places?w=600&h=400&u=3",
              description:
                "Engaging curriculum fostering critical thinking and creativity",
            },
            {
              title: "High School",
              image: "https://img.heroui.chat/image/places?w=600&h=400&u=4",
              description:
                "College preparatory programs for academic excellence",
            },
          ].map((program, index) => (
            <Card key={index} className="border-none" shadow="sm">
              <CardBody className="p-0">
                <Image
                  removeWrapper
                  alt={program.title}
                  className="h-48 w-full object-cover"
                  src={program.image}
                />
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold">
                    {program.title}
                  </h3>
                  <p className="text-default-600">{program.description}</p>
                  <Button
                    color="primary"
                    variant="flat"
                    radius="sm"
                    className="mt-4"
                  >
                    Learn More
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
