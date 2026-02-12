import type { FrontendBlock } from "@/types/blocks";
import {
  getBlockBaseClass,
  getBlockClasses,
  getBlockStyleAttr,
} from "@/utils/blockStyles";
import { stripOuterTag } from "@/utils/htmlTransformations";

const Paragraph: React.FC<FrontendBlock> = ({ name, attributes, saveContent }) => {
  const { align, anchor, style, ...otherAttributes } = attributes || {};
  const blockClasses = getBlockClasses(
    { ...otherAttributes, textAlign: align },
    getBlockBaseClass(name)
  );
  const blockStyleAttr = getBlockStyleAttr(style);
  const html = stripOuterTag(saveContent || "", "p");

  return (
    <p
      {...(anchor && { id: anchor })}
      className={blockClasses}
      {...(style && { style: blockStyleAttr })}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Paragraph;
