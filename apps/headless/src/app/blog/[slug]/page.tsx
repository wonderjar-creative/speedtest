import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { POST_BY_SLUG_QUERY, POST_SLUGS_QUERY } from "@/lib/queries/posts";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import type { Post } from "@/lib/types";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const data = await fetchGraphQL<{ posts: { nodes: { slug: string }[] } }>(POST_SLUGS_QUERY);
    return (data?.posts?.nodes ?? []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const data = await fetchGraphQL<{ post: Post | null }>(POST_BY_SLUG_QUERY, { slug });
    if (!data?.post) return {};
    return {
      title: data.post.title,
      description: data.post.excerpt?.replace(/<[^>]*>/g, "").slice(0, 160) || `${data.post.title} — Elevation Design Studio`,
    };
  } catch {
    return {};
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const data = await fetchGraphQL<{ post: Post | null }>(POST_BY_SLUG_QUERY, { slug });
  const post = data?.post;

  if (!post) notFound();

  const imageUrl = post.featuredImage?.node?.sourceUrl;

  return (
    <>
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[300px]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.featuredImage?.node?.altText || post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-[900px] mx-auto px-6 pb-12 w-full">
            <time className="text-sm text-gray-300 mb-3 block">{formatDate(post.date)}</time>
            <h1 className="text-3xl md:text-4xl text-white">{post.title}</h1>
          </div>
        </div>
      </div>

      <SectionWrapper>
        <div className="max-w-[900px] mx-auto">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-16 pt-8 border-t border-gray-200">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary hover:text-accent no-underline font-medium"
            >
              &larr; Back to Blog
            </Link>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
