import Image from "next/image";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import type { TeamMember } from "@/lib/types";

interface TeamGridProps {
  teamMembers: TeamMember[];
}

export function TeamGrid({ teamMembers }: TeamGridProps) {
  return (
    <SectionWrapper bg="gray">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
        Our Team
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {teamMembers.map((member) => {
          const imageUrl =
            member.featuredImage?.node.sourceUrl ||
            member.teamMemberFields.photoUrl;

          return (
            <div key={member.id} className="text-center">
              <div className="relative w-[200px] h-[200px] mx-auto mb-6">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={member.title}
                    fill
                    className="object-cover rounded-full"
                    sizes="200px"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold text-gray-500">
                    {member.title.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-1">{member.title}</h3>
              <p className="text-primary font-medium mb-3">
                {member.teamMemberFields.position}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {member.teamMemberFields.bio}
              </p>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
