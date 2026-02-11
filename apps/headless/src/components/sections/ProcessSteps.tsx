import { SectionWrapper } from "@/components/ui/SectionWrapper";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We listen to your vision, assess your space, and understand your lifestyle to create a design brief that guides every decision.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Our team develops detailed concepts, 3D renderings, and material palettes so you can see your space come to life before construction begins.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "We manage every detail of construction, coordinating with contractors and craftspeople to ensure your design is executed flawlessly.",
  },
  {
    number: "04",
    title: "Deliver",
    description:
      "We do a final walkthrough, style and stage your space, and hand over the keys to your beautifully transformed environment.",
  },
];

export function ProcessSteps() {
  return (
    <SectionWrapper bg="white">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Process</h2>
        <p className="text-gray-600 text-lg">
          A proven approach that delivers results every time
        </p>
      </div>
      <div className="relative">
        <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-gray-300" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step) => (
            <div key={step.number} className="text-center relative">
              <p className="text-5xl font-bold text-primary mb-4">
                {step.number}
              </p>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
