/**
 * Renders a WordPress block pattern by fetching its blocks via ISR
 * and recursively rendering.
 */

import { fetchPatternWithISR } from "./isrFetchers";
import { enrichBlocksWithMedia } from "./blockMedia";
import getBlockComponents from "./getBlockComponents";
import type { ContentNode } from "@/types/blocks";

const renderPattern = async (
  slug: string,
  page: ContentNode | null,
  stylesCollector?: string[],
  _index?: number
) => {
  try {
    // Strip theme prefix (e.g., "elevation-theme/hero" → "hero")
    const cleanSlug = slug.replace(/^[^/]+\//, "");

    const pattern = await fetchPatternWithISR(cleanSlug);

    if (pattern && pattern.blocksJSON) {
      const patternBlocks = JSON.parse(pattern.blocksJSON);
      const enrichedBlocks = await enrichBlocksWithMedia(patternBlocks);
      const components = await getBlockComponents(
        enrichedBlocks,
        page,
        stylesCollector
      );
      return components;
    }
    return null;
  } catch (error) {
    console.error(`Error rendering pattern: ${slug}`, error);
    return null;
  }
};

export default renderPattern;
