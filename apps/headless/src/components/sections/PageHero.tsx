import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

export function PageHero({
  title,
  subtitle,
  imageUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
}: PageHeroProps) {
  return (
    <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
      <Image
        src={imageUrl}
        alt={title}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gray-900/60" />
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
