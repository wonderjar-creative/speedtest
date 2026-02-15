import { FrontendBlock } from '@/types/coreBlockTypes';
import { CoreColumnBlockAttributes } from '@/gql/graphql';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';

export interface CoreColumnBlock extends FrontendBlock {
  attributes?: CoreColumnBlockAttributes;
}

const Column: React.FC<CoreColumnBlock> = ({ name, attributes, innerBlocks }) => {
  const { style, width } = attributes || {};

  return (
    <div
      className={getBlockClasses(attributes || {}, `${getBlockBaseClass(name)} flow flex-grow flex-basis-0 break-words md:flex-1`)}
      style={{
        ...getBlockStyleAttr(style),
        flexBasis: width || undefined,
      }}
    >
      {innerBlocks}
    </div>
  );
}

export default Column;
