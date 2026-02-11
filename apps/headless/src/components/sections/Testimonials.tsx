import { SectionWrapper } from "@/components/ui/SectionWrapper";
import type { Testimonial } from "@/lib/types";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < rating ? "text-yellow-400" : "text-gray-300"}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const featured = testimonials.slice(0, 3);

  return (
    <SectionWrapper bg="white">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          What Our Clients Say
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Hear from the people who have trusted us with their spaces
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featured.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white p-8 rounded-lg shadow-sm"
          >
            <StarRating rating={testimonial.testimonialFields.rating} />
            <p className="italic text-gray-600 leading-relaxed mb-6">
              &ldquo;{stripHtml(testimonial.content)}&rdquo;
            </p>
            <div>
              <p className="font-semibold text-gray-900">
                {testimonial.testimonialFields.authorName}
              </p>
              <p className="text-sm text-gray-500">
                {testimonial.testimonialFields.authorRole}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
