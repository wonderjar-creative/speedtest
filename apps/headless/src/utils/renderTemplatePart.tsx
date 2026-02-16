import { fetchTemplatePartWithISR } from "./isrFetchers";
import { enrichBlocksWithMedia } from "./blockMedia";
import getBlockComponents, { ContentNodeWithBlocks } from "./getBlockComponents";
import getPart from "./getPart";

const getSemanticTag = (slug: string): keyof JSX.IntrinsicElements => {
  if (slug.includes('header')) return 'header';
  if (slug.includes('footer')) return 'footer';
  if (slug.includes('sidebar')) return 'aside';
  return 'div';
};

const renderTemplatePart = async (
  slug: string,
  page: ContentNodeWithBlocks,
  stylesCollector?: string[],
  index?: number
) => {
  try {
    // Try ISR first, fallback to static
    let part = await fetchTemplatePartWithISR(slug);
    if (!part || !part.blocksJSON) {
      part = getPart(slug);
    }

    if (part) {
      const partBlocks = JSON.parse(part.blocksJSON || '[]');
      const enrichedBlocks = await enrichBlocksWithMedia(partBlocks);
      const components = await getBlockComponents(enrichedBlocks, page, stylesCollector);

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
}

export default renderTemplatePart;
