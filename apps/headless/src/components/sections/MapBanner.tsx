import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function MapBanner() {
  return (
    <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1524813686514-a57563d77965?w=1920&q=80"
        alt="Denver skyline"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gray-900/60" />
      <div className="relative z-10 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Visit Our Studio
        </h2>
        <p className="text-lg text-gray-200 mb-8">
          Located in Denver&apos;s Design District
        </p>
        <Button
          href="https://www.google.com/maps/search/1234+Design+District+Denver+CO+80202"
          variant="white"
        >
          Get Directions
        </Button>
      </div>
    </section>
  );
}
