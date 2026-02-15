import { FrontendBlock } from '@/types/coreBlockTypes';
import { CoreButtonsBlockAttributes } from '@/gql/graphql';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';

export interface CoreButtonsBlock extends FrontendBlock {
  attributes?: CoreButtonsBlockAttributes;
}

const Buttons: React.FC<CoreButtonsBlock> = ({ name, attributes, innerBlocks }) => {
  const { anchor, style } = attributes || {};
  const blockClasses = getBlockClasses(attributes || {}, getBlockBaseClass(name));
  const blockStyleAttr = getBlockStyleAttr(style);

  return (
    <div
      {...(anchor && { id: anchor })}
      className={blockClasses}
      {...(style && { style: blockStyleAttr })}
    >
      {innerBlocks}
    </div>
  );
}

export default Buttons;
