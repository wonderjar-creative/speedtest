import { ContentNode } from '@/gql/graphql';
import { fetchTemplateWithISR } from '@/utils/isrFetchers';
import getTemplate from '@/utils/getTemplate';
import { enrichBlocksWithMedia } from '@/utils/blockMedia';
import getBlockComponents from '@/utils/getBlockComponents';

interface ContentNodeWithPostsPage extends Omit<ContentNode, 'isPostsPage'> {
  isPostsPage?: boolean;
}

interface TemplateProps {
  node: ContentNodeWithPostsPage;
}

const IndexTemplate = async ({ node }: TemplateProps) => {
  const stylesCollector: string[] = [];

  // Always use the 'index' template for the posts page
  let template = await fetchTemplateWithISR('index');

  if (!template) {
    template = getTemplate('index');
  }

  if (!template?.blocksJSON) {
    console.error('Index template not found');
    return <div>Index template not found</div>;
  }

  // Parse template blocks
  let blocks = [];
  try {
    blocks = JSON.parse(template.blocksJSON || '[]');
    if (!Array.isArray(blocks)) {
      blocks = [];
    }
  } catch (e) {
    console.error('Failed to parse index template blocksJSON:', e);
    blocks = [];
  }

  // Enrich blocks with media
  const enrichedBlocks = await enrichBlocksWithMedia(blocks);

  // Render components - pass null for page since this is an archive, not a specific page
  const renderedComponents = await getBlockComponents(enrichedBlocks, null, stylesCollector);

  return (
    <>
      {stylesCollector.length > 0 && <style>{stylesCollector.join('\n')}</style>}
      {renderedComponents}
    </>
  );
};

export default IndexTemplate;
