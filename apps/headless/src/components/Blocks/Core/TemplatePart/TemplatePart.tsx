import { FrontendBlock } from '@/types/coreBlockTypes';
import { CoreTemplatePartBlockAttributes } from '@/gql/graphql';
import { getBlockBaseClass } from '@/utils/blockStyles';

export interface CoreTemplatePartBlock extends FrontendBlock {
  attributes?: CoreTemplatePartBlockAttributes;
}

const TemplatePart: React.FC<CoreTemplatePartBlock> = ({ name, attributes, innerBlocks }) => {
  return (
    <div className={`${getBlockBaseClass(name)} ${attributes?.slug ? `wp-template-part-${attributes.slug}` : ''}`}>
      {innerBlocks}
    </div>
  );
};

export default TemplatePart;
