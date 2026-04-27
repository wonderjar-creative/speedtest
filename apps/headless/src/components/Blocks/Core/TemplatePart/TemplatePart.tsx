import type { JSX } from 'react';
import { FrontendBlock } from '@/types/coreBlockTypes';
import { CoreTemplatePartBlockAttributes } from '@/gql/graphql';
import { getBlockBaseClass } from '@/utils/blockStyles';

export interface CoreTemplatePartBlock extends FrontendBlock {
  attributes?: CoreTemplatePartBlockAttributes;
}

const TemplatePart: React.FC<CoreTemplatePartBlock> = ({ name, attributes, innerBlocks }) => {
  const Tag = (attributes?.tagName || 'div') as keyof JSX.IntrinsicElements;
  return (
    <Tag className={`${getBlockBaseClass(name)} ${attributes?.slug ? `wp-template-part-${attributes.slug}` : ''}`}>
      {innerBlocks}
    </Tag>
  );
};

export default TemplatePart;
