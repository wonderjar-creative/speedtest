/**
 * Index (blog archive) template renderer.
 *
 * Uses the "home" or "index" template from WordPress to render
 * the blog posts listing page.
 */

import { fetchTemplateWithISR } from "@/utils/isrFetchers";
import { enrichBlocksWithMedia } from "@/utils/blockMedia";
import getBlockComponents from "@/utils/getBlockComponents";
import type { ContentNode } from "@/types/blocks";

interface IndexTemplateProps {
  node: ContentNode;
}

const IndexTemplate = async ({ node }: IndexTemplateProps) => {
  const stylesCollector: string[] = [];

  // Try "home" template first (WordPress blog index), then "index"
  let template = await fetchTemplateWithISR("home");
  if (!template) {
    template = await fetchTemplateWithISR("index");
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
      node,
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

  return <p>Blog template not found.</p>;
};

export default IndexTemplate;
