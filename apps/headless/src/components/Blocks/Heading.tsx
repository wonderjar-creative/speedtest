import type { FrontendBlock } from "@/types/blocks";
import {
  getBlockBaseClass,
  getBlockClasses,
  getBlockStyleAttr,
} from "@/utils/blockStyles";
import { stripOuterTag, getTransformedHtml } from "@/utils/htmlTransformations";

const Heading: React.FC<FrontendBlock> = ({ name, attributes, saveContent }) => {
  const { anchor, level, style } = attributes || {};
  const blockClasses = getBlockClasses(attributes || {}, getBlockBaseClass(name));
  const blockStyleAttr = getBlockStyleAttr(style);
  const Tag = (`h${level || 2}`) as keyof JSX.IntrinsicElements;
  const content = stripOuterTag(saveContent || "", Tag as string);
  const html = getTransformedHtml(content || "");

  return (
    <Tag
      {...(anchor && { id: anchor })}
      className={blockClasses}
      {...(style && { style: blockStyleAttr })}
    >
      {html}
    </Tag>
  );
};

export default Heading;
