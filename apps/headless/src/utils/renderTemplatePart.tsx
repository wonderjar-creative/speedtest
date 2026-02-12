/**
 * Renders a WordPress template part (header, footer, sidebar)
 * by fetching its blocks via ISR and recursively rendering.
 */

import { fetchTemplatePartWithISR } from "./isrFetchers";
import { enrichBlocksWithMedia } from "./blockMedia";
import getBlockComponents from "./getBlockComponents";
import type { ContentNode } from "@/types/blocks";

const getSemanticTag = (slug: string): keyof JSX.IntrinsicElements => {
  if (slug.includes("header")) return "header";
  if (slug.includes("footer")) return "footer";
  if (slug.includes("sidebar")) return "aside";
  return "div";
};

const renderTemplatePart = async (
  slug: string,
  page: ContentNode | null,
  stylesCollector?: string[],
  index?: number
) => {
  try {
    const part = await fetchTemplatePartWithISR(slug);
    if (part) {
      const partBlocks = JSON.parse(part.blocksJSON || "[]");
      const enrichedBlocks = await enrichBlocksWithMedia(partBlocks);
      const components = await getBlockComponents(
        enrichedBlocks,
        page,
        stylesCollector
      );

      const TagName = getSemanticTag(slug);
      return (
        <TagName
          key={`template-part-${slug}-${index}`}
          className={`wp-block-template-part wp-block-template-part-${slug}`}
        >
          {components}
        </TagName>
      );
    }
    return null;
  } catch (error) {
    console.error(`Error rendering template part: ${slug}`, error);
    return null;
  }
};

export default renderTemplatePart;
