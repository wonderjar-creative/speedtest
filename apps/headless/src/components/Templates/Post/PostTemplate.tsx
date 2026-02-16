import { print } from "graphql/language/printer";

import { ContentNode, Post } from "@/gql/graphql";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { fetchTemplateWithISR } from "@/utils/isrFetchers";
import getTemplate from "@/utils/getTemplate";
import { enrichBlocksWithMedia } from "@/utils/blockMedia";
import getBlockComponents from "@/utils/getBlockComponents";

import { PostQuery } from "./PostQuery";

interface TemplateProps {
  node: ContentNode;
}

interface PostWithTemplate extends Post {
  templateSlug?: string;
}

export default async function PostTemplate({ node }: TemplateProps) {
  const { post } = await fetchGraphQL<{ post: PostWithTemplate }>(
    print(PostQuery),
    {
      id: node.databaseId,
    },
  );

  const stylesCollector: string[] = [];

  // templateSlug comes from custom WP theme field, default to 'single' for posts
  const templateSlug = post.templateSlug || "single";

  // Try ISR first, fallback to static
  let template = await fetchTemplateWithISR(templateSlug);
  if (!template) {
    template = getTemplate(templateSlug) || {
      name: templateSlug,
      blocksJSON: post.blocksJSON,
    };
  }

  // Parse template blocks (but don't resolve template parts/patterns yet)
  let blocks = [];
  try {
    blocks = JSON.parse(template.blocksJSON || "[]");
    if (!Array.isArray(blocks)) {
      blocks = [];
    }
  } catch (e) {
    console.error("Failed to parse template blocksJSON:", e);
    blocks = [];
  }

  // Enrich only the top-level template blocks
  const enrichedBlocks = await enrichBlocksWithMedia(blocks);

  // Render components (this will handle template parts/patterns recursively)
  const renderedComponents = await getBlockComponents(
    enrichedBlocks,
    post,
    stylesCollector,
  );

  return (
    <>
      {stylesCollector.length > 0 && <style>{stylesCollector.join("\n")}</style>}
      {renderedComponents}
    </>
  );
}
