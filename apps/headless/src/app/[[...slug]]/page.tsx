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

  const { contentNode } = await fetchGraphQL<{ contentNode: ContentNode }>(
    print(SeoQuery),
    {
      slug: isPreview ? slug.split("preview/")[1] : slug,
      idType: isPreview ? "DATABASE_ID" : "URI",
    },
  );

  // If contentNode is null, check if this might be the posts page
  if (!contentNode) {
    const { pages } = await fetchGraphQL<{ pages: { nodes: PostsPageNode[] } }>(
      print(PostsPageQuery),
    );

    const postsPage = pages?.nodes?.find((page) => page.isPostsPage);

    if (postsPage && postsPage.slug === slug) {
      // Return basic metadata for posts page
      return {
        title: postsPage.title,
        alternates: {
          canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`,
        },
      };
    }

    return notFound();
  }

  const seoData = setSeoData({ seo: contentNode.seo, slug });

  return {
    ...seoData,
    alternates: {
      canonical: seoData.canonicalUrl,
    },
  } as Metadata;
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

  // Fetch content info and SEO data in parallel
  const [{ contentNode }, { contentNode: seoNode }] = await Promise.all([
    fetchGraphQL<{ contentNode: ContentNode }>(print(ContentInfoQuery), {
      slug: wpSlug,
      idType,
    }),
    fetchGraphQL<{ contentNode: ContentNode }>(print(SeoQuery), {
      slug: wpSlug,
      idType,
    }),
  ]);

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
