/**
 * Renders the core/post-content block.
 *
 * Uses the page's own blocksData to render content within
 * a template context.
 */

import { enrichBlocksWithMedia } from "./blockMedia";
import getBlockComponents from "./getBlockComponents";
import { getBlockBaseClass, getBlockClasses } from "./blockStyles";
import type { ContentNode } from "@/types/blocks";

const renderPostContent = async (
  blockName: string,
  attributes: Record<string, any> | undefined,
  page: ContentNode | null,
  stylesCollector?: string[],
  index?: number
) => {
  try {
    const blocksJSON = page?.blocksData || "[]";
    const blocks = JSON.parse(blocksJSON);
    const enrichedBlocks = await enrichBlocksWithMedia(blocks);
    const components = await getBlockComponents(
      enrichedBlocks,
      page,
      stylesCollector
    );

    return (
      <div
        key={index}
        className={getBlockClasses(
          attributes || {},
          getBlockBaseClass(blockName)
        )}
      >
        {components}
      </div>
    );
  } catch (error) {
    console.error("Error rendering post content:", error);
    return null;
  }
};

export default renderPostContent;
