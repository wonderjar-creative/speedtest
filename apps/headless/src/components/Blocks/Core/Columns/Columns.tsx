import { FrontendBlock } from '@/types/coreBlockTypes';
import { CoreColumnsBlockAttributes } from '@/gql/graphql';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';

export interface CoreColumnsBlock extends FrontendBlock {
  attributes?: CoreColumnsBlockAttributes;
}

const Columns: React.FC<CoreColumnsBlock> = ({ name, attributes, innerBlocks }) => {
  const { style } = attributes || {};

  return (
    <div
      className={getBlockClasses(attributes || {}, getBlockBaseClass(name))}
      style={getBlockStyleAttr(style)}
    >
      {innerBlocks}
    </div>
  );
}

export default Columns;
