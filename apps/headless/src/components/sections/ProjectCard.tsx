import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const imageUrl =
    project.featuredImage?.node.sourceUrl || project.projectFields.photoUrl;
  const altText = project.featuredImage?.node.altText || project.title;

  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group block rounded-lg overflow-hidden relative no-underline"
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
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent" />
        {project.projectFields.location && (
          <span className="absolute top-4 left-4 bg-white/90 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
            {project.projectFields.location}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-bold text-white">{project.title}</h3>
        </div>
      </div>
    </Link>
  );
}
