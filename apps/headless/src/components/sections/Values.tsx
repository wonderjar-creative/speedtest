import { SectionWrapper } from "@/components/ui/SectionWrapper";

const values = [
  {
    letter: "C",
    title: "Craftsmanship",
    description:
      "We believe in quality over quantity, taking the time to get every detail right.",
  },
  {
    letter: "C",
    title: "Collaboration",
    description:
      "Your vision drives our work. We listen, adapt, and create together.",
  },
  {
    letter: "S",
    title: "Sustainability",
    description:
      "Thoughtful design that respects both people and the environment.",
  },
];

export function Values() {
  return (
    <SectionWrapper bg="white">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
        Our Values
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {values.map((value) => (
          <div key={value.title} className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary text-2xl font-bold flex items-center justify-center mx-auto mb-6">
              {value.letter}
            </div>
            <h3 className="text-xl font-bold mb-3">{value.title}</h3>
            <p className="text-gray-600 leading-relaxed">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
