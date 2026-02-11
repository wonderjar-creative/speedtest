import type { Metadata } from "next";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { ALL_POSTS_QUERY } from "@/lib/queries/posts";
import { PageHero } from "@/components/sections/PageHero";
import { PostGrid } from "@/components/sections/PostGrid";
import { CTA } from "@/components/sections/CTA";
import type { Post } from "@/lib/types";

export const metadata: Metadata = {
  title: "Blog",
  description: "Design insights, project stories, and industry trends from Elevation Design Studio.",
};

export const revalidate = 60;

export default async function BlogPage() {
  let posts: Post[] = [];

  try {
    const data = await fetchGraphQL<{ posts: { nodes: Post[] } }>(ALL_POSTS_QUERY);
    posts = data?.posts?.nodes ?? [];
  } catch {
    // GraphQL fetch failed
  }

  return (
    <>
      <PageHero
        title="Our Blog"
        subtitle="Design insights, project stories, and industry trends"
        imageUrl="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80"
      />
      <PostGrid posts={posts} />
      <CTA />
    </>
  );
}
