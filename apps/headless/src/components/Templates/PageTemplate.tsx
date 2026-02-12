/**
 * Page template renderer.
 *
 * Fetches the page data via GraphQL, loads the appropriate template
 * via ISR, and renders all blocks (including header/footer template parts).
 */

import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { fetchTemplateWithISR } from "@/utils/isrFetchers";
import { enrichBlocksWithMedia } from "@/utils/blockMedia";
import getBlockComponents from "@/utils/getBlockComponents";
import { PAGE_BLOCKS_QUERY } from "@/lib/queries/pageBlocks";
import type { ContentNode } from "@/types/blocks";

interface PageTemplateProps {
  node: ContentNode;
}

const PageTemplate = async ({ node }: PageTemplateProps) => {
  const { page } = await fetchGraphQL<{ page: ContentNode }>(
    PAGE_BLOCKS_QUERY,
    { id: node.databaseId }
  );

  const stylesCollector: string[] = [];

  // Determine which template to use
  const templateSlug = page.templateSlug || "page";

  // Fetch the template structure via ISR
  let template = await fetchTemplateWithISR(templateSlug);

  // Fallback to default "page" template
  if (!template && templateSlug !== "page") {
    template = await fetchTemplateWithISR("page");
  }

  // If we have a template, render its blocks (which include header, post-content, footer)
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
      page,
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

  // Fallback: render page blocks directly without template wrapper
  const blocksJSON = page.blocksData || "[]";
  let blocks = [];
  try {
    blocks = JSON.parse(blocksJSON);
  } catch {
    blocks = [];
  }

  const enrichedBlocks = await enrichBlocksWithMedia(blocks);
  const renderedComponents = await getBlockComponents(
    enrichedBlocks,
    page,
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

export default PageTemplate;
