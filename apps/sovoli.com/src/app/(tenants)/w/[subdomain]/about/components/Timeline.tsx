import React from "react";

interface TimelineEventProps {
  year: string;
  title: string;
  description: string;
}

const TimelineEvent = ({ year, title, description }: TimelineEventProps) => {
  return (
    <div className="relative flex gap-6">
      <div className="flex flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
          {year}
        </div>
        <div className="h-full w-0.5 bg-default-200"></div>
      </div>
      <div className="pb-10">
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="text-foreground-600">{description}</p>
      </div>
    </div>
  );
};

export const Timeline = () => {
  const events = [
    {
      year: "1985",
      title: "Foundation",
      description:
        "Modern Academy was established with a small campus and 120 students.",
    },
    {
      year: "1995",
      title: "Campus Expansion",
      description:
        "Expanded our facilities to accommodate growing enrollment and added new programs.",
    },
    {
      year: "2005",
      title: "Technology Integration",
      description:
        "Pioneered the integration of technology in classrooms and launched our digital learning platform.",
    },
    {
      year: "2015",
      title: "International Recognition",
      description:
        "Received international accreditation and established exchange programs with global institutions.",
    },
    {
      year: "2023",
      title: "Innovation Center",
      description:
        "Opened our state-of-the-art Innovation Center to foster research and entrepreneurship.",
    },
  ];

  return (
    <div className="relative">
      {events.map((event, index) => (
        <React.Fragment key={index}>
          <TimelineEvent
            year={event.year}
            title={event.title}
            description={event.description}
          />
          {index === events.length - 1 && (
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full border-2 border-dashed border-primary bg-background"></div>
              </div>
              <div className="pb-2">
                <p className="italic text-foreground-500">
                  The journey continues...
                </p>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
