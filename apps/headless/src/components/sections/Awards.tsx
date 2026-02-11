import { SectionWrapper } from "@/components/ui/SectionWrapper";

const awards = [
  { title: "AIA Colorado Design Award", year: "2023" },
  { title: "Denver Business Journal Best in Design", year: "2022" },
  { title: "ASID Design Excellence Award", year: "2021" },
  { title: "Colorado Homes & Lifestyles Top Designer", year: "2020-2023" },
];

export function Awards() {
  return (
    <SectionWrapper bg="white">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
        Awards & Recognition
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {awards.map((award) => (
          <div
            key={award.title}
            className="bg-gray-100 rounded-lg p-6 text-center"
          >
            <p className="text-primary font-bold text-lg mb-2">{award.year}</p>
            <p className="text-gray-700 font-medium">{award.title}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
