"use client";

import { useState } from "react";

import { Avatar } from "@sovoli/ui/components/avatar";
import { Button } from "@sovoli/ui/components/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@sovoli/ui/components/carousel";
import { StarIcon, QuoteIcon } from "lucide-react";
import { format } from "date-fns";

import type { ProgramTestimonial } from "~/modules/academics/types";
import { SiFacebook, SiGoogle } from "@icons-pack/react-simple-icons";
import { ProgramSectionsWrapper } from "./ProgramSectionsWrapper";
import type { Program } from "~/modules/academics/types";

interface ProgramTestimonialsSectionProps {
  testimonials?: ProgramTestimonial[];
  program: Program;
}

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon
          key={index}
          className={`h-3 w-3 ${
            index < rating ? "text-warning fill-warning" : "text-default-300"
          }`}
        />
      ))}
    </div>
  );
}

// Source Icon Component
function SourceIcon({ source }: { source?: string }) {
  const getSourceIcon = (source?: string) => {
    switch (source) {
      case "google":
        return <SiGoogle className="h-4 w-4" />;
      case "facebook":
        return <SiFacebook className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return getSourceIcon(source);
}

// Testimonial Card Component
function TestimonialCard({ testimonial }: { testimonial: ProgramTestimonial }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = testimonial.content.length > 150;
  const displayContent = isExpanded
    ? testimonial.content
    : testimonial.content.substring(0, 150);

  return (
    <div className="flex flex-col gap-4 p-6 bg-background rounded-lg border border-default-200 hover:border-primary-300 transition-colors h-full">
      {/* Rating, Date, and Link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StarRating rating={testimonial.rating} />
          {testimonial.date && (
            <>
              <span className="text-xs text-default-400">•</span>
              <span className="text-xs text-default-500">
                {format(new Date(testimonial.date), "MMM yyyy")}
              </span>
            </>
          )}
        </div>
        {testimonial.link && (
          <a
            href={testimonial.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:opacity-80"
          >
            <SourceIcon source={testimonial.source} />
          </a>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-sm text-foreground-600 leading-relaxed">
          {displayContent}
          {shouldTruncate && !isExpanded && "..."}
        </p>
        {shouldTruncate && (
          <button
            className="text-sm text-primary hover:underline mt-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {/* Reviewer Info */}
      <div className="flex items-center gap-2 pt-1 border-t border-default-100">
        <Avatar name={testimonial.author} className="h-8 w-8" isBordered />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm truncate leading-tight">
            {testimonial.author}
          </h3>
          <span className="text-xs text-default-400 leading-tight">
            {testimonial.relation}
          </span>
        </div>
      </div>
    </div>
  );
}

// Show All Reviews Button Component
function ShowAllReviewsButton({ count }: { count: number }) {
  return (
    <div className="flex justify-center">
      <Button variant="flat" color="default" size="lg">
        Show all {count} reviews
      </Button>
    </div>
  );
}

export function ProgramTestimonialsSection({
  testimonials,
  program,
}: ProgramTestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <ProgramSectionsWrapper program={program}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <QuoteIcon className="h-6 w-6 text-primary" />
            What Parents Say
          </h2>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-4 basis-[85%] md:basis-[45%]"
              >
                <TestimonialCard testimonial={testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Show All Reviews Button */}
        {testimonials.length > 2 && (
          <ShowAllReviewsButton count={testimonials.length} />
        )}
      </div>
    </ProgramSectionsWrapper>
  );
}
