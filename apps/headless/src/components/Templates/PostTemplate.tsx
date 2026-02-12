/**
 * Post template renderer.
 *
 * Similar to PageTemplate but uses the "single" template
 * and fetches post-specific data (date, categories, tags).
 */

import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { fetchTemplateWithISR } from "@/utils/isrFetchers";
import { enrichBlocksWithMedia } from "@/utils/blockMedia";
import getBlockComponents from "@/utils/getBlockComponents";
import { POST_BLOCKS_QUERY } from "@/lib/queries/postBlocks";
import type { ContentNode } from "@/types/blocks";

interface PostTemplateProps {
  node: ContentNode;
}

const PostTemplate = async ({ node }: PostTemplateProps) => {
  const { post } = await fetchGraphQL<{ post: ContentNode }>(
    POST_BLOCKS_QUERY,
    { id: node.databaseId }
  );

  const stylesCollector: string[] = [];
  const templateSlug = post.templateSlug || "single";

  let template = await fetchTemplateWithISR(templateSlug);
  if (!template && templateSlug !== "single") {
    template = await fetchTemplateWithISR("single");
  }

  if (template?.blocksJSON) {
    let blocks = [];
    try {
      blocks = JSON.parse(template.blocksJSON || "[]");
      if (!Array.isArray(blocks)) blocks = [];
    } catch {
      blocks = [];
    }

    const enrichedBlocks = await enrichBlocksWithMedia(blocks);
    const renderedComponents = await getBlockComponents(
      enrichedBlocks,
      post,
      stylesCollector
    );

    return (
      <>
        {stylesCollector.length > 0 && (
          <style>{stylesCollector.join("\n")}</style>
        )}
        {renderedComponents}
      </>
    );
  }

  // Fallback: render post blocks directly
  const blocksJSON = post.blocksData || "[]";
  let blocks = [];
  try {
    blocks = JSON.parse(blocksJSON);
  } catch {
    blocks = [];
  }

  const enrichedBlocks = await enrichBlocksWithMedia(blocks);
  const renderedComponents = await getBlockComponents(
    enrichedBlocks,
    post,
    stylesCollector
  );

  return (
    <>
      {stylesCollector.length > 0 && (
        <style>{stylesCollector.join("\n")}</style>
      )}
      {renderedComponents}
    </>
  );
};

export default PostTemplate;
