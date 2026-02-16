import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { print } from "graphql/language/printer";

import { setSeoData } from "@/utils/seoData";

import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { ContentInfoQuery } from "@/queries/general/ContentInfoQuery";
import { PostsPageQuery } from "@/queries/general/PostsPageQuery";
import { ContentNode } from "@/gql/graphql";
import PageTemplate from "@/components/Templates/Page/PageTemplate";
import IndexTemplate from "@/components/Templates/Index/IndexTemplate";
import { nextSlugToWpSlug } from "@/utils/nextSlugToWpSlug";
import PostTemplate from "@/components/Templates/Post/PostTemplate";
import { SeoQuery } from "@/queries/general/SeoQuery";
import { JsonLd } from "@/components/Globals/JsonLd/JsonLd";

interface PostsPageNode {
  databaseId: number;
  title: string;
  slug: string;
  status: string;
  isPostsPage: boolean;
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const _params = await params;
  const slug = nextSlugToWpSlug(_params.slug);
  const isPreview = slug.includes("preview");

  // Try SEO query first (requires WPGraphQL for Rank Math plugin)
  try {
    const { contentNode } = await fetchGraphQL<{ contentNode: ContentNode }>(
      print(SeoQuery),
      {
        slug: isPreview ? slug.split("preview/")[1] : slug,
        idType: isPreview ? "DATABASE_ID" : "URI",
      },
    );

    if (contentNode?.seo) {
      const seoData = setSeoData({ seo: contentNode.seo, slug });
      return {
        ...seoData,
        alternates: {
          canonical: seoData.canonicalUrl,
        },
      } as Metadata;
    }
  } catch {
    // SEO plugin not available — fall through to basic metadata
  }

  // Fallback: use ContentInfoQuery for basic metadata
  try {
    const { contentNode } = await fetchGraphQL<{ contentNode: ContentNode }>(
      print(ContentInfoQuery),
      {
        slug: isPreview ? slug.split("preview/")[1] : slug,
        idType: isPreview ? "DATABASE_ID" : "URI",
      },
    );

    if (contentNode) {
      return {
        title: slug === "/" ? "Home" : slug.replace(/\//g, " ").trim(),
      };
    }
  } catch {
    // Content not found
  }

  // Check if this might be the posts page
  try {
    const { pages } = await fetchGraphQL<{ pages: { nodes: PostsPageNode[] } }>(
      print(PostsPageQuery),
    );
    const postsPage = pages?.nodes?.find((page) => page.isPostsPage);
    if (postsPage && postsPage.slug === slug) {
      return {
        title: postsPage.title,
        alternates: {
          canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`,
        },
      };
    }
  } catch {
    // Posts page query failed
  }

  return { title: slug === "/" ? "Home" : slug };
}

export function generateStaticParams() {
  return [
    { slug: undefined }, // Pre-build homepage at deploy time
  ];
}

export const revalidate = 300; // 5 minutes

export default async function Page({ params }: Props) {
  const _params = await params;
  const slug = nextSlugToWpSlug(_params.slug);
  const isPreview = slug.includes("preview");
  const wpSlug = isPreview ? slug.split("preview/")[1] : slug;
  const idType = isPreview ? "DATABASE_ID" : "URI";

  // Fetch content info (required) and SEO data (optional — needs WPGraphQL for Rank Math)
  const [{ contentNode }, seoResult] = await Promise.all([
    fetchGraphQL<{ contentNode: ContentNode }>(print(ContentInfoQuery), {
      slug: wpSlug,
      idType,
    }),
    fetchGraphQL<{ contentNode: ContentNode }>(print(SeoQuery), {
      slug: wpSlug,
      idType,
    }).catch(() => ({ contentNode: null })),
  ]);
  const seoNode = seoResult.contentNode;

  // If contentNode is null, check if this might be the posts page
  // (Posts page has uri: null in WordPress but is accessed via its slug)
  if (!contentNode) {
    const { pages } = await fetchGraphQL<{ pages: { nodes: PostsPageNode[] } }>(
      print(PostsPageQuery),
    );

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

  // Check if this page is the designated posts page (blog index)
  if (contentNode.contentTypeName === "page" && contentNode.isPostsPage) {
    return <IndexTemplate node={contentNode} />;
  }

  // Extract JSON-LD from SEO data
  const jsonLd = seoNode?.seo?.jsonLd?.raw;

  const renderTemplate = () => {
    switch (contentNode.contentTypeName) {
      case "page":
        return <PageTemplate node={contentNode} />;
      case "post":
        return <PostTemplate node={contentNode} />;
      default:
        return <p>{contentNode.contentTypeName} not implemented</p>;
    }
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      {renderTemplate()}
    </>
  );
}
