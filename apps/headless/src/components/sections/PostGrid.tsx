import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { PostCard } from "@/components/sections/PostCard";
import type { Post } from "@/lib/types";

interface PostGridProps {
  posts: Post[];
}

export function PostGrid({ posts }: PostGridProps) {
  return (
    <SectionWrapper bg="white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </SectionWrapper>
  );
}
