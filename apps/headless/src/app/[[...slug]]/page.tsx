/**
 * Catch-all route for the headless frontend.
 *
 * Handles all pages and posts by:
 * 1. Determining content type via GraphQL
 * 2. Delegating to the appropriate template renderer
 * 3. Template renderers fetch blocks and render them
 *
 * Ported from wonderjar-frontend [[...slug]]/page.tsx.
 */

import { notFound } from "next/navigation";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { nextSlugToWpSlug } from "@/utils/nextSlugToWpSlug";
import { CONTENT_INFO_QUERY, POSTS_PAGE_QUERY } from "@/lib/queries/contentInfo";
import PageTemplate from "@/components/Templates/PageTemplate";
import PostTemplate from "@/components/Templates/PostTemplate";
import IndexTemplate from "@/components/Templates/IndexTemplate";
import type { ContentNode } from "@/types/blocks";

interface PostsPageNode {
  databaseId: number;
  title: string;
  slug: string;
  status: string;
  isPostsPage: boolean;
}

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export function generateStaticParams() {
  return [
    { slug: undefined }, // Pre-build homepage at deploy time
  ];
}

export const revalidate = 300; // 5 minutes

export default async function Page({ params }: Props) {
  const _params = await params;
  const slug = nextSlugToWpSlug(_params.slug as string | string[] | undefined);
  const isPreview = slug.includes("preview");
  const wpSlug = isPreview ? slug.split("preview/")[1] : slug;
  const idType = isPreview ? "DATABASE_ID" : "URI";

  // Fetch content info to determine type
  const { contentNode } = await fetchGraphQL<{
    contentNode: ContentNode | null;
  }>(CONTENT_INFO_QUERY, {
    slug: wpSlug,
    idType,
  });

  // If contentNode is null, check if this might be the posts page
  if (!contentNode) {
    const { pages } = await fetchGraphQL<{
      pages: { nodes: PostsPageNode[] };
    }>(POSTS_PAGE_QUERY);

    const postsPage = pages?.nodes?.find((page) => page.isPostsPage);

    if (postsPage && postsPage.slug === slug) {
      return (
        <IndexTemplate
          node={{ databaseId: postsPage.databaseId } as ContentNode}
        />
      );
    }

    return notFound();
  }

  // Blog index page
  if (contentNode.contentTypeName === "page" && contentNode.isPostsPage) {
    return <IndexTemplate node={contentNode} />;
  }

  // Route to appropriate template
  switch (contentNode.contentTypeName) {
    case "page":
      return <PageTemplate node={contentNode} />;
    case "post":
      return <PostTemplate node={contentNode} />;
    default:
      return <p>{contentNode.contentTypeName} template not implemented</p>;
  }
}
