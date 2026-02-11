import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ProjectCard } from "@/components/sections/ProjectCard";
import type { Project } from "@/lib/types";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <SectionWrapper bg="white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </SectionWrapper>
  );
}
