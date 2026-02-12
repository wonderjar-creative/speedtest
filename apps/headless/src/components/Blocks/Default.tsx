import type { FrontendBlock } from "@/types/blocks";
import { getBlockClasses, getBlockStyleAttr } from "@/utils/blockStyles";

const Default: React.FC<FrontendBlock> = ({
  attributes,
  dynamicContent,
  saveContent,
  innerBlocks,
}) => {
  const { anchor, style, tagName } = attributes || {};
  const blockClasses = getBlockClasses(attributes || {}, "wp-block-default");
  const blockStyleAttr = getBlockStyleAttr(style);
  const Tag = (tagName || "div") as keyof JSX.IntrinsicElements;
  const hasInnerBlocks = Array.isArray(innerBlocks) && innerBlocks.length > 0;
  const html = dynamicContent || saveContent || "";

  if (hasInnerBlocks) {
    return (
      <Tag
        {...(anchor && { id: anchor })}
        className={blockClasses}
        {...(style && { style: blockStyleAttr })}
      >
        {innerBlocks}
      </Tag>
    );
  }

  if (html) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return null;
};

export default Default;
