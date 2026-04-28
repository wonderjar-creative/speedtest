import { fetchPatternWithISR } from './isrFetchers';
import { enrichBlocksWithMedia } from './blockMedia';
import getBlockComponents, { ContentNodeWithBlocks, LcpState } from './getBlockComponents';
import getPattern from './getPattern';

const renderPattern = async (
  slug: string,
  page: ContentNodeWithBlocks,
  stylesCollector?: string[],
  index?: number,
  lcpState?: LcpState,
) => {
  try {
    const cleanSlug = slug.replace(/^[^/]+\//, '');

    // Try ISR first, fallback to static
    let pattern = await fetchPatternWithISR(cleanSlug);
    if (!pattern || !pattern.blocksJSON) {
      pattern = getPattern(cleanSlug);
    }

    if (pattern && pattern.blocksJSON) {
      const patternBlocks = JSON.parse(pattern.blocksJSON);
      const enrichedBlocks = await enrichBlocksWithMedia(patternBlocks);
      const components = await getBlockComponents(enrichedBlocks, page, stylesCollector, lcpState);

      return components;
    }
    return null;
  } catch (error) {
    console.error(`Error rendering pattern: ${slug}`, error);
    return null;
  }
}

export default renderPattern;
