import type { Metadata } from "next";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { ALL_TEAM_MEMBERS_QUERY } from "@/lib/queries/team";
import { PageHero } from "@/components/sections/PageHero";
import { Story } from "@/components/sections/Story";
import { Approach } from "@/components/sections/Approach";
import { Values } from "@/components/sections/Values";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { Awards } from "@/components/sections/Awards";
import { CTA } from "@/components/sections/CTA";
import type { TeamMember } from "@/lib/types";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Elevation Design Studio — Denver's award-winning architecture and interior design firm since 2010.",
};

export const revalidate = 60;

export default async function AboutPage() {
  let teamMembers: TeamMember[] = [];

  try {
    const data = await fetchGraphQL<{ teamMembers: { nodes: TeamMember[] } }>(ALL_TEAM_MEMBERS_QUERY);
    teamMembers = data?.teamMembers?.nodes ?? [];
    teamMembers.sort((a, b) => (a.teamMemberFields?.order ?? 0) - (b.teamMemberFields?.order ?? 0));
  } catch {
    // GraphQL fetch failed
  }

  return (
    <>
      <PageHero
        title="About Elevation Design"
        subtitle="Creating spaces that inspire since 2010"
        imageUrl="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80"
      />
      <Story />
      <Approach />
      <Values />
      <TeamGrid teamMembers={teamMembers} />
      <Awards />
      <CTA />
    </>
  );
}
