import { enrichBlocksWithMedia } from './blockMedia';
import getBlockComponents, { ContentNodeWithBlocks } from './getBlockComponents';
import { getBlockBaseClass, getBlockClasses } from './blockStyles';

const renderPostContent = async (
  blockName: string,
  attributes: Record<string, any> | undefined,
  page: ContentNodeWithBlocks,
  stylesCollector?: string[],
  index?: number
) => {
  try {
    const blocks = JSON.parse(page?.blocksJSON || '[]');
    const enrichedBlocks = await enrichBlocksWithMedia(blocks);
    const components = await getBlockComponents(enrichedBlocks, page, stylesCollector);

    return (
      <div
        key={index}
        className={`${getBlockClasses(attributes || {}, getBlockBaseClass(blockName))}`}
      >
        {components}
      </div>
    );
  } catch (error) {
    console.error('Error rendering post content:', error);
    return null;
  }
};

export default renderPostContent;
