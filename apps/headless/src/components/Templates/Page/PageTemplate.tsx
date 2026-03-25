import { ContentNode, Page } from '@/gql/graphql';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import { print } from 'graphql/language/printer';
import { PageQuery } from './PageQuery';
import { fetchTemplateWithISR } from '@/utils/isrFetchers';
import getTemplate from '@/utils/getTemplate';
import { enrichBlocksWithMedia } from '@/utils/blockMedia';
import getBlockComponents from '@/utils/getBlockComponents';

interface TemplateProps {
  node: ContentNode;
}

interface PageWithTemplate extends Page {
  templateSlug?: string;
}

const PageTemplate = async ({ node }: TemplateProps) => {
  const { page } = await fetchGraphQL<{ page: PageWithTemplate }>(print(PageQuery), {
    id: node.databaseId,
  });

  const stylesCollector: string[] = [];

  // Use front-page template for the designated front page, otherwise fall back to templateSlug or 'page'
  const templateSlug = page.isFrontPage ? 'front-page' : (page.templateSlug || 'page');

  // Try ISR first, fallback to static
  let template = await fetchTemplateWithISR(templateSlug);
  if (!template) {
    template = getTemplate(templateSlug) || { name: templateSlug, blocksJSON: page.blocksJSON };
  }

  // Parse template blocks (but don't resolve template parts/patterns yet)
  let blocks = [];
  try {
    blocks = JSON.parse(template.blocksJSON || '[]');
    if (!Array.isArray(blocks)) {
      blocks = [];
    }
  } catch (e) {
    console.error('Failed to parse template blocksJSON:', e);
    blocks = [];
  }

  // Enrich only the top-level template blocks
  const enrichedBlocks = await enrichBlocksWithMedia(blocks);

  // Render components (this will handle template parts/patterns recursively)
  const renderedComponents = await getBlockComponents(enrichedBlocks, page, stylesCollector);

  return (
    <>
      {stylesCollector.length > 0 && <style>{stylesCollector.join('\n')}</style>}
      {renderedComponents}
    </>
  );
};

export default PageTemplate;
