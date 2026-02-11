import { SectionWrapper } from "@/components/ui/SectionWrapper";

const logos = [
  "Alpine Corp",
  "Front Range Holdings",
  "Mile High Properties",
  "Confluence Ventures",
  "Summit Partners",
  "Red Rocks Capital",
];

export function ClientLogos() {
  return (
    <SectionWrapper bg="gray">
      <p className="text-center text-sm uppercase tracking-wider text-gray-500 mb-10">
        Trusted by Leading Organizations
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
        {logos.map((name) => (
          <div key={name} className="text-center">
            <span className="font-serif font-bold text-lg text-gray-400">
              {name}
            </span>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
