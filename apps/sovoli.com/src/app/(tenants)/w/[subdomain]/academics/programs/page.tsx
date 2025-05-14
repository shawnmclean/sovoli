import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Image } from "@sovoli/ui/components/image";

const programsData = [
  {
    title: "Elementary Education",
    image: "https://img.heroui.chat/image/places?w=600&h=400&u=2",
    description: "Strong foundational learning in a nurturing environment",
    curriculum: "Basic literacy, numeracy, science, and social skills.",
    duration: "6 years",
    ageGroup: "5-11 years",
    requirements:
      "Birth certificate, immunization record, completed application form.",
  },
  {
    title: "Middle School",
    image: "https://img.heroui.chat/image/places?w=600&h=400&u=3",
    description:
      "Engaging curriculum fostering critical thinking and creativity",
    curriculum:
      "Mathematics, language arts, science, social studies, arts, and physical education.",
    duration: "3 years",
    ageGroup: "12-14 years",
    requirements:
      "Completion of Elementary Education, application form, parent/guardian ID.",
  },
  {
    title: "High School",
    image: "https://img.heroui.chat/image/places?w=600&h=400&u=4",
    description: "College preparatory programs for academic excellence",
    curriculum:
      "Advanced mathematics, sciences, literature, history, vocational courses, and electives.",
    duration: "4 years",
    ageGroup: "15-18 years",
    requirements:
      "Completion of Middle School, application form, parent/guardian ID.",
  },
];

export default function ProgramsPage() {
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-bold">Our Programs</h2>
        <div className="space-y-6">
          {programsData.map((program, index) => (
            <Card
              key={index}
              className="overflow-visible border-none"
              shadow="sm"
            >
              <CardBody className="flex flex-col gap-6 p-4 md:flex-row">
                <Image
                  removeWrapper
                  alt={program.title}
                  className="h-48 w-full object-cover md:w-1/3"
                  src={program.image}
                />
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-semibold">{program.title}</h3>
                  <p className="text-default-600">{program.description}</p>
                  <p className="text-sm text-default-500">
                    <strong>Curriculum:</strong> {program.curriculum}
                  </p>
                  <p className="text-sm text-default-500">
                    <strong>Duration:</strong> {program.duration}
                  </p>
                  <p className="text-sm text-default-500">
                    <strong>Age Group:</strong> {program.ageGroup}
                  </p>
                  <p className="text-sm text-default-500">
                    <strong>Requirements:</strong> {program.requirements}
                  </p>
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
