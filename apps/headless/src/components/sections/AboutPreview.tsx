import Image from "next/image";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";

export function AboutPreview() {
  return (
    <SectionWrapper bg="white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Denver&apos;s Award-Winning Design Studio
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed mb-8">
            For over 15 years, Elevation Design Studio has been transforming
            homes and commercial spaces across Colorado. Our team of architects
            and designers brings creativity, precision, and a deep understanding
            of how people live and work.
          </p>
          <Button href="/about" variant="primary">
            Learn More About Us
          </Button>
        </div>
        <div className="relative">
          <Image
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
            alt="Modern interior design showcase"
            width={800}
            height={600}
            className="rounded-lg w-full h-auto"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
