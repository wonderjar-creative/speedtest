import type { FrontendBlock } from "@/types/blocks";
import {
  getBlockBaseClass,
  getBlockClasses,
  getBlockStyleAttr,
} from "@/utils/blockStyles";

const Group: React.FC<FrontendBlock> = ({ name, attributes, innerBlocks }) => {
  const { anchor, style, tagName } = attributes || {};
  const blockClasses = getBlockClasses(attributes || {}, getBlockBaseClass(name));
  const blockStyleAttr = getBlockStyleAttr(style);
  const Tag = (tagName || "div") as keyof JSX.IntrinsicElements;

  return (
    <Tag
      {...(anchor && { id: anchor })}
      className={blockClasses}
      {...(style && { style: blockStyleAttr })}
    >
      {innerBlocks}
    </Tag>
  );
};

export default Group;
