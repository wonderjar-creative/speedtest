import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CTA } from "@/components/sections/CTA";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

export const metadata: Metadata = {
  title: "Services",
  description: "Comprehensive design solutions — residential, commercial, consultation, and renovation services from Elevation Design Studio.",
};

const services = [
  {
    id: "residential",
    title: "Residential Design",
    description: "Transform your home into a personalized sanctuary. From single-room makeovers to complete home renovations, we create spaces that reflect your lifestyle and aesthetic.",
    features: ["Full home design", "Kitchen & bath remodels", "Space planning", "Custom furniture selection"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    id: "commercial",
    title: "Commercial Spaces",
    description: "Create inspiring workplaces that boost productivity and reflect your brand. We design offices, retail spaces, and hospitality venues that make an impression.",
    features: ["Office design", "Retail environments", "Restaurant & hospitality", "Brand integration"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
  {
    id: "consultation",
    title: "Design Consultation",
    description: "Not ready for a full project? Our consultation services provide expert guidance to help you make informed decisions about your space.",
    features: ["Color consultation", "Furniture layout", "Material selection", "Project planning"],
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
  },
  {
    id: "renovation",
    title: "Renovation & Remodeling",
    description: "Breathe new life into existing spaces. Whether it\u2019s a historic restoration or a modern update, we bring expertise and vision to every renovation project.",
    features: ["Historic preservation", "Modern updates", "Structural modifications", "Energy efficiency upgrades"],
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Comprehensive design solutions tailored to your needs"
        imageUrl="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
      />

      {services.map((service, index) => (
        <SectionWrapper key={service.id} id={service.id} bg={index % 2 === 0 ? "white" : "gray"}>
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? "lg:direction-rtl" : ""}`}>
            <div className={index % 2 !== 0 ? "lg:order-2" : ""}>
              <h2 className="text-3xl md:text-4xl mb-6">{service.title}</h2>
              <p className="text-gray-600 text-lg mb-8">{service.description}</p>
              <ul className="space-y-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`relative aspect-4/3 rounded-lg overflow-hidden ${index % 2 !== 0 ? "lg:order-1" : ""}`}>
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </SectionWrapper>
      ))}

      <ProcessSteps />
      <CTA />
    </>
  );
}
