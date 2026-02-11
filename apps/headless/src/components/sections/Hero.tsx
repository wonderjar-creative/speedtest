import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
        alt="Modern architectural home exterior"
        fill
        priority={true}
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900/80" />
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
          Elevation Design Studio
        </h1>
        <p className="text-xl md:text-2xl font-serif mb-4 text-white/90">
          Architecture & Interior Design that elevates your space
        </p>
        <p className="text-lg text-white/75 max-w-2xl mx-auto mb-10">
          Award-winning residential and commercial design across Colorado since 2010
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/portfolio" variant="primary">
            View Our Work
          </Button>
          <Button href="/contact" variant="white">
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
