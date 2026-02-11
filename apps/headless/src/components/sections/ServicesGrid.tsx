import Link from "next/link";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const services = [
  {
    title: "Residential Design",
    description:
      "Transform your home into a personalized sanctuary with our residential design services.",
    icon: (
      <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    title: "Commercial Spaces",
    description:
      "Create inspiring workplaces that boost productivity and reflect your brand identity.",
    icon: (
      <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    title: "Consultation",
    description:
      "Expert guidance to help you make informed decisions about your design project.",
    icon: (
      <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    title: "Renovation & Remodeling",
    description:
      "Breathe new life into existing spaces with thoughtful renovation and remodeling solutions.",
    icon: (
      <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1a2.121 2.121 0 113-3l5.1 5.1m0 0l2.06 2.06a2.121 2.121 0 01-3 3l-2.06-2.06zm0 0L9.36 17.24m7.04-10.68l2.12-2.12a2.121 2.121 0 113 3L19.4 9.56m-2.34-2.34L14.12 10.16" />
      </svg>
    ),
  },
];

export function ServicesGrid() {
  return (
    <SectionWrapper bg="white">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Comprehensive design solutions for every space
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service) => (
          <div
            key={service.title}
            className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-5">{service.icon}</div>
            <h3 className="text-xl font-bold mb-3">{service.title}</h3>
            <p className="text-gray-500 mb-5 leading-relaxed">
              {service.description}
            </p>
            <Link
              href="/services"
              className="text-primary font-semibold text-sm hover:text-accent transition-colors"
            >
              Learn More &rarr;
            </Link>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
