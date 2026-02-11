import Image from "next/image";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

export function Story() {
  return (
    <SectionWrapper bg="white">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-3">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Elevation Design Studio was founded with a simple belief: great
            design should elevate everyday life. What started as a small
            residential practice in Denver has grown into a full-service
            architecture and interior design firm.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            We approach each project with fresh eyes and a commitment to
            understanding our clients&apos; unique needs, lifestyle, and
            aesthetic preferences. Our collaborative process ensures that every
            space we create is both beautiful and functional.
          </p>
        </div>
        <div className="md:col-span-2">
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
              alt="Elevation Design Studio workspace"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
