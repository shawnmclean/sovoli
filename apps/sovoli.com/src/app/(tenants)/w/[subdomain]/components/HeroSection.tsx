import { Button } from "@sovoli/ui/components/button";
import { Image } from "@sovoli/ui/components/image";

export function HeroSection() {
  return (
    <section className="relative z-0 h-[600px] w-full">
      <Image
        removeWrapper
        alt="Modern Academy Campus"
        className="h-full w-full object-cover brightness-50"
        src="https://img.heroui.chat/image/places?w=1920&h=600&u=1"
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-white">
        <h1 className="mb-4 max-w-4xl text-center text-4xl font-bold md:text-5xl">
          Empowering Minds, Shaping Futures
        </h1>
        <p className="mb-8 max-w-2xl text-center text-lg md:text-xl">
          Join a community dedicated to academic excellence and personal growth
        </p>
        <Button
          size="lg"
          color="primary"
          variant="solid"
          radius="sm"
          className="font-semibold"
        >
          Apply Now
        </Button>
      </div>
    </section>
  );
}
