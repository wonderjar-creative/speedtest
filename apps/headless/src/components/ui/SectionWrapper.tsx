interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  bg?: "white" | "gray" | "dark" | "primary";
  id?: string;
}

const bgClasses = {
  white: "bg-white",
  gray: "bg-gray-100",
  dark: "bg-gray-900 text-white",
  primary: "bg-primary text-white",
};

export function SectionWrapper({ children, className = "", bg = "white", id }: SectionWrapperProps) {
  return (
    <section id={id} className={`py-20 md:py-28 ${bgClasses[bg]} ${className}`}>
      <div className="max-w-[1400px] mx-auto px-6">
        {children}
      </div>
    </section>
  );
}
