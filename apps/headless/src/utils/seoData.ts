import { Page } from "@/gql/graphql";

/**
 * Parse Rank Math robots meta directive array
 * Example: ["index", "follow"] or ["noindex", "nofollow"]
 */
const parseRobotsDirective = (robots?: Array<string | null> | null) => {
  if (!robots || robots.length === 0) return { index: true, follow: true };

  const directives = robots
    .filter((r): r is string => r !== null)
    .map((d) => d.toLowerCase());

  return {
    index: !directives.includes("noindex"),
    follow: !directives.includes("nofollow"),
  };
};

/**
 * SEO data return type including JSON-LD for structured data
 */
export type SeoDataResult = {
  metadataBase: URL;
  title: string;
  description: string;
  robots: { index: boolean; follow: boolean };
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
    locale: string;
    type: string;
    publishedTime?: string;
    modifiedTime?: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    images: string[];
  };
  canonicalUrl?: string;
  jsonLd?: string;
};

/**
 * Transform Rank Math SEO data to Next.js Metadata format
 */
export const setSeoData = ({
  seo,
  slug,
}: {
  seo: Page["seo"];
  slug?: string;
}): Partial<SeoDataResult> => {
  if (!seo) return {};

  const robotsDirective = parseRobotsDirective(seo.robots);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  // Use Rank Math canonical if set, otherwise construct from slug
  const canonicalUrl =
    seo.canonicalUrl || (slug ? `${baseUrl}${slug}` : undefined);

  // Get image alt from title as fallback
  const imageAlt = seo.openGraph?.title || seo.title || "";

  return {
    metadataBase: new URL(baseUrl),
    title: seo.title || "",
    description: seo.description || "",
    robots: robotsDirective,
    openGraph: {
      title: seo.openGraph?.title || seo.title || "",
      description: seo.openGraph?.description || seo.description || "",
      url: seo.openGraph?.url || canonicalUrl || "",
      siteName: seo.openGraph?.siteName || "",
      images: seo.openGraph?.image?.url
        ? [
            {
              url: seo.openGraph.image.url,
              width: seo.openGraph.image.width || 1200,
              height: seo.openGraph.image.height || 630,
              alt: imageAlt,
            },
          ]
        : [],
      locale: seo.openGraph?.locale || "en_US",
      type: (seo.openGraph?.type as string) || "website",
      ...(seo.openGraph?.articleMeta?.publishedTime && {
        publishedTime: seo.openGraph.articleMeta.publishedTime,
      }),
      ...(seo.openGraph?.articleMeta?.modifiedTime && {
        modifiedTime: seo.openGraph.articleMeta.modifiedTime,
      }),
    },
    twitter: {
      card:
        (seo.openGraph?.twitterMeta?.card as string) || "summary_large_image",
      title:
        seo.openGraph?.twitterMeta?.title ||
        seo.openGraph?.title ||
        seo.title ||
        "",
      description:
        seo.openGraph?.twitterMeta?.description ||
        seo.openGraph?.description ||
        seo.description ||
        "",
      images: seo.openGraph?.twitterMeta?.image
        ? [seo.openGraph.twitterMeta.image]
        : [],
    },
    canonicalUrl,
    jsonLd: seo.jsonLd?.raw || undefined,
  };
};
