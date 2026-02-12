import type { FrontendBlock } from "@/types/blocks";
import {
  getBlockBaseClass,
  getBlockClasses,
  getBlockStyleAttr,
} from "@/utils/blockStyles";

const Column: React.FC<FrontendBlock> = ({ name, attributes, innerBlocks }) => {
  const { style, width } = attributes || {};

  return (
    <div
      className={getBlockClasses(
        attributes || {},
        `${getBlockBaseClass(name)} flow flex-grow flex-basis-0 break-words md:flex-1`
      )}
      style={{
        ...getBlockStyleAttr(style),
        flexBasis: width || undefined,
      }}
    >
      {innerBlocks}
    </div>
  );
};

export default Column;
