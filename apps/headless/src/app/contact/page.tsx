import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContactInfo } from "@/components/sections/ContactInfo";
import { MapBanner } from "@/components/sections/MapBanner";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Elevation Design Studio. Schedule a free consultation for your residential or commercial design project.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Get in Touch"
        subtitle="Ready to start your project? We'd love to hear from you."
        imageUrl="https://images.unsplash.com/photo-1524813686514-a57563d77965?w=1920&q=80"
      />

      <SectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <ContactForm />
          <ContactInfo />
        </div>
      </SectionWrapper>

      <MapBanner />
    </>
  );
}
