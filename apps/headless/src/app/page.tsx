import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { ALL_PROJECTS_QUERY } from "@/lib/queries/projects";
import { ALL_TESTIMONIALS_QUERY } from "@/lib/queries/testimonials";
import { Hero } from "@/components/sections/Hero";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { StatsCounter } from "@/components/sections/StatsCounter";
import { PortfolioPreview } from "@/components/sections/PortfolioPreview";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";
import type { Project, Testimonial } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage() {
  let projects: Project[] = [];
  let testimonials: Testimonial[] = [];

  try {
    const [projectsData, testimonialsData] = await Promise.all([
      fetchGraphQL<{ projects: { nodes: Project[] } }>(ALL_PROJECTS_QUERY),
      fetchGraphQL<{ testimonials: { nodes: Testimonial[] } }>(ALL_TESTIMONIALS_QUERY),
    ]);
    projects = projectsData?.projects?.nodes ?? [];
    testimonials = testimonialsData?.testimonials?.nodes ?? [];
  } catch {
    // GraphQL fetch failed — render with empty data
  }

  return (
    <>
      <Hero />
      <ClientLogos />
      <ServicesGrid />
      <StatsCounter />
      <PortfolioPreview projects={projects} />
      <AboutPreview />
      <Testimonials testimonials={testimonials} />
      <CTA />
    </>
  );
}
