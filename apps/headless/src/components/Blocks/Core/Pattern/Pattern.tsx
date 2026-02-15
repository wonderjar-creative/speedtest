import { FrontendBlock, ContentNodeWithBlocks } from '@/types/coreBlockTypes';
import { CorePatternBlockAttributes } from '@/gql/graphql';
import getPattern from '@/utils/getPattern';
import getBlockComponents from '@/utils/getBlockComponents';

export interface CorePatternBlock extends FrontendBlock {
  attributes?: CorePatternBlockAttributes;
  page: ContentNodeWithBlocks;
}

const Pattern: React.FC<CorePatternBlock> = async ({ name, attributes, page }: CorePatternBlock) => {
  const { slug } = attributes || {};

  const pattern = getPattern(slug || '');

  if (!pattern) {
    return <div className="pattern-not-found">Pattern not found: {slug}</div>;
  }

  const blocks = JSON.parse(pattern.blocksJSON || '[]');

  return <>{await getBlockComponents(blocks, page, [])}</>;
}

export default Pattern;
