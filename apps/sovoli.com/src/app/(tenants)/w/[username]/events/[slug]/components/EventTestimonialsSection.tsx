import type { Event, EventTestimonial } from "~/modules/events/types";
import { Star, Quote } from "lucide-react";

interface EventTestimonialsSectionProps {
  testimonials?: EventTestimonial[];
  event: Event;
}

export function EventTestimonialsSection({
  testimonials,
  event,
}: EventTestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">What People Say</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < testimonial.rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-start space-x-2 mb-4">
              <Quote className="h-5 w-5 text-gray-400 mt-1" />
              <p className="text-gray-700 italic">"{testimonial.content}"</p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="font-semibold text-gray-900">
                {testimonial.author}
              </p>
              <p className="text-sm text-gray-600">{testimonial.relation}</p>
              {testimonial.date && (
                <p className="text-xs text-gray-500 mt-1">{testimonial.date}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
