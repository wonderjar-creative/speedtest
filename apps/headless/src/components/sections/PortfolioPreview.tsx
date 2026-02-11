import Image from "next/image";
import Link from "next/link";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import type { Project } from "@/lib/types";

interface PortfolioPreviewProps {
  projects: Project[];
}

export function PortfolioPreview({ projects }: PortfolioPreviewProps) {
  const featured = projects.slice(0, 3);

  return (
    <SectionWrapper bg="gray">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Featured Projects
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          A selection of our recent work
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {featured.map((project) => {
          const imageUrl =
            project.featuredImage?.node.sourceUrl ||
            project.projectFields.photoUrl;
          const altText =
            project.featuredImage?.node.altText || project.title;

          return (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className="group block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow no-underline"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={altText}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-300" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {project.title}
                  </h3>
                  {project.projectFields.location && (
                    <p className="text-sm text-white/75">
                      {project.projectFields.location}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="text-center">
        <Button href="/portfolio" variant="primary">
          View All Projects
        </Button>
      </div>
    </SectionWrapper>
  );
}
