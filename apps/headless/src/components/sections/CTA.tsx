import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <SectionWrapper bg="primary">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          Ready to Transform Your Space?
        </h2>
        <p className="text-lg text-white/85 leading-relaxed mb-10">
          Let&apos;s discuss your project and bring your vision to life.
          Schedule a free consultation today.
        </p>
        <Button href="/contact" variant="white">
          Schedule a Consultation
        </Button>
        <p className="mt-6 text-sm text-white/70">
          Or call us directly: (303) 555-0123
        </p>
      </div>
    </SectionWrapper>
  );
}
