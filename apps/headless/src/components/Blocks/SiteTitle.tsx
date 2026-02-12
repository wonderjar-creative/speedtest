import type { FrontendBlock } from "@/types/blocks";
import {
  getBlockBaseClass,
  getBlockClasses,
  getBlockStyleAttr,
} from "@/utils/blockStyles";
import { stripOuterTag } from "@/utils/htmlTransformations";

const SiteTitle: React.FC<FrontendBlock> = ({
  name,
  attributes,
  dynamicContent,
  saveContent,
}) => {
  const { level, style } = attributes || {};
  const blockClasses = getBlockClasses(attributes || {}, getBlockBaseClass(name));
  const blockStyleAttr = getBlockStyleAttr(style || {});
  const Tag = (`h${level || 2}`) as keyof JSX.IntrinsicElements;
  const content = dynamicContent || saveContent;
  const html = stripOuterTag(content || "", Tag as string);

  return (
    <Tag
      className={blockClasses}
      style={blockStyleAttr}
      dangerouslySetInnerHTML={{ __html: html || "" }}
    />
  );
};

export default SiteTitle;
