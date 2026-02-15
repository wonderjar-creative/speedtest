import { FrontendBlock } from '@/types/coreBlockTypes';
import { CoreGroupBlockAttributes } from '@/gql/graphql';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';

export interface CoreGroupBlock extends FrontendBlock {
  attributes?: CoreGroupBlockAttributes;
}

const Group: React.FC<CoreGroupBlock> = ({ name, attributes, innerBlocks }) => {
  const { anchor, style, tagName } = attributes || {};
  const blockClasses = getBlockClasses(attributes || {}, getBlockBaseClass(name));
  const blockStyleAttr = getBlockStyleAttr(style);
  const Tag = tagName || 'div';
  const TagComponent = Tag as keyof JSX.IntrinsicElements;

  return (
    <TagComponent
      {...(anchor && { id: anchor })}
      className={blockClasses}
      {...(style && { style: blockStyleAttr })}
    >
      {innerBlocks}
    </TagComponent>
  );
}

export default Group;
