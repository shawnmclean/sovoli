import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody } from "@sovoli/ui/components/card";
import { Image } from "@sovoli/ui/components/image";

export function NewsSection() {
  return (
    <section className="bg-background1 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-bold">
          News & Announcements
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              date: "May 20, 2025",
              title: "Our New Web Platform Launches!",
              image: "https://img.heroui.chat/image/places?w=600&h=400&u=5",
              description:
                "Updates, Students and Parent Portals, and more to come!",
            },
          ].map((news, index) => (
            <Card key={index} className="border-none" shadow="sm">
              <CardBody className="p-0">
                <Image
                  removeWrapper
                  alt={news.title}
                  className="h-48 w-full object-cover"
                  src={news.image}
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold">{news.title}</h3>
                  <p className="mb-2 text-sm text-default-600">{news.date}</p>
                  <p className="text-default-600">{news.description}</p>
                  <Button
                    as="a"
                    href="/news"
                    color="primary"
                    variant="flat"
                    radius="sm"
                    className="mt-4"
                  >
                    Read More
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
