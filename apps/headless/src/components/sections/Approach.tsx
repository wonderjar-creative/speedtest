import Image from "next/image";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

export function Approach() {
  return (
    <SectionWrapper bg="gray">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-2">
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80"
              alt="Interior design process"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>
        <div className="md:col-span-3">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Approach</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Every project begins with listening. We take the time to understand
            not just what you want your space to look like, but how you want it
            to feel. Our designs are rooted in the way people actually live and
            work.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            From concept through completion, our team manages every detail. We
            coordinate with contractors, artisans, and suppliers to ensure the
            highest quality execution of every design element.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
