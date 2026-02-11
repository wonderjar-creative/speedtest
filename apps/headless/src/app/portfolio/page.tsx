import type { Metadata } from "next";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { ALL_PROJECTS_QUERY } from "@/lib/queries/projects";
import { PageHero } from "@/components/sections/PageHero";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { CTA } from "@/components/sections/CTA";
import type { Project } from "@/lib/types";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Explore our portfolio of residential and commercial design projects across Colorado.",
};

export const revalidate = 60;

export default async function PortfolioPage() {
  let projects: Project[] = [];

  try {
    const data = await fetchGraphQL<{ projects: { nodes: Project[] } }>(ALL_PROJECTS_QUERY);
    projects = data?.projects?.nodes ?? [];
  } catch {
    // GraphQL fetch failed
  }

  return (
    <>
      <PageHero
        title="Our Portfolio"
        subtitle="A showcase of our finest work"
        imageUrl="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=80"
      />
      <ProjectGrid projects={projects} />
      <CTA />
    </>
  );
}
