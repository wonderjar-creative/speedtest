import { Maybe } from "@/gql/graphql";
import { EnrichedBlock } from "@/types/coreBlockTypes";

const collectMediaIds = (blocks: EnrichedBlock[]): number[] => {
  const ids = new Set<number>();
  function walk(blocks: any[]) {
    for (const block of blocks) {
      const id = block?.attributes?.id;
      if (typeof id === "number") ids.add(id);
      if (block.innerBlocks && block.innerBlocks.length > 0) walk(block.innerBlocks);
    }
  }
  walk(blocks);
  return Array.from(ids);
}

const fetchMediaDetailsByIds = async (mediaIds: number[]): Promise<Record<number, any>> => {
  const results = await Promise.all(
    mediaIds.map(id =>
      fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL || ""}/wp-json/wp/v2/media/${id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => [id, data])
    )
  );
  return Object.fromEntries(results.filter(([, data]) => data));
}

const enrichBlocks = (blocks: EnrichedBlock[], mediaMap: Record<number, any>): EnrichedBlock[] => {
  return blocks.map(block => {
    let enriched = { ...block };
    const id = block?.attributes?.id;
    if (id && mediaMap[id]) {
      const media = mediaMap[id];
      enriched.mediaItem = {
        node: {
          sourceUrl: media.source_url,
          altText: media.alt_text,
          mediaDetails: {
            width: media.media_details?.width,
            height: media.media_details?.height,
            sizes: media.media_details?.sizes,
          },
        },
      };
    }
    const innerBlocks = block.innerBlocks;
    if (innerBlocks && innerBlocks.length > 0) {
      enriched.innerBlocks = enrichBlocks(innerBlocks, mediaMap);
    }
    return enriched;
  });
}

export const enrichBlocksWithMedia = async (
  blocks: EnrichedBlock[]
): Promise<EnrichedBlock[]> => {
  const mediaIds = collectMediaIds(blocks);
  if (mediaIds.length === 0) return blocks;
  const mediaMap = await fetchMediaDetailsByIds(mediaIds);
  return enrichBlocks(blocks, mediaMap);
}
