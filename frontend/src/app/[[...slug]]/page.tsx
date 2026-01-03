import { notFound } from "next/navigation";
import { print } from "graphql/language/printer";
import { fetchGraphQL } from "@/utils/fetchGraphQL";

// Import your GraphQL queries here
// import { ContentInfoQuery } from "@/queries/general/ContentInfoQuery";
// import { ContentNode } from "@/gql/graphql";

type Props = {
  params: Promise<{ slug: string[] | undefined }>;
};

/**
 * Helper to convert Next.js slug array to WordPress URI
 */
function nextSlugToWpSlug(slug: string[] | undefined): string {
  if (!slug || slug.length === 0) return "/";
  return slug.join("/");
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const wpSlug = nextSlugToWpSlug(slug);

  // TODO: Fetch SEO data from WordPress
  // const { contentNode } = await fetchGraphQL<{ contentNode: ContentNode }>(
  //   print(SeoQuery),
  //   { slug: wpSlug, idType: "URI" }
  // );

  return {
    title: wpSlug === "/" ? "Home" : wpSlug,
    // Add more metadata from WordPress SEO plugin
  };
}

export function generateStaticParams() {
  return [
    { slug: undefined }, // Pre-build homepage at deploy time
  ];
}

export const revalidate = 300; // 5 minutes ISR

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const wpSlug = nextSlugToWpSlug(slug);

  // TODO: Implement your content fetching logic
  // This is a placeholder - replace with actual WordPress content fetching

  // Example:
  // const { contentNode } = await fetchGraphQL<{ contentNode: ContentNode }>(
  //   print(ContentInfoQuery),
  //   { slug: wpSlug, idType: "URI" }
  // );
  //
  // if (!contentNode) {
  //   return notFound();
  // }
  //
  // switch (contentNode.contentTypeName) {
  //   case "page":
  //     return <PageTemplate node={contentNode} />;
  //   case "post":
  //     return <PostTemplate node={contentNode} />;
  //   default:
  //     return <p>{contentNode.contentTypeName} not implemented</p>;
  // }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">
        {wpSlug === "/" ? "Home" : wpSlug}
      </h1>
      <p className="text-gray-600">
        This is a placeholder page. Connect your WordPress instance and implement
        the content fetching logic in this file.
      </p>
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Next Steps:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Configure your WordPress URL in .env.development.local</li>
          <li>Run <code className="bg-gray-200 px-1">npm run codegen</code> to generate GraphQL types</li>
          <li>Implement GraphQL queries in src/queries/</li>
          <li>Uncomment and customize the content fetching logic above</li>
          <li>Create block components in src/components/Blocks/</li>
        </ol>
      </div>
    </main>
  );
}
