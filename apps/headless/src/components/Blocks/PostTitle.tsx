import type { FrontendBlock, ContentNode } from "@/types/blocks";
import {
  getBlockBaseClass,
  getBlockClasses,
  getBlockStyleAttr,
} from "@/utils/blockStyles";
import { stripOuterTag } from "@/utils/htmlTransformations";

interface PostTitleProps extends FrontendBlock {
  page?: ContentNode | null;
}

const PostTitle: React.FC<PostTitleProps> = ({
  name,
  attributes,
  dynamicContent,
  saveContent,
  page,
}) => {
  const { level, style } = attributes || {};
  const blockClasses = getBlockClasses(attributes || {}, getBlockBaseClass(name));
  const blockStyleAttr = getBlockStyleAttr(style || {});
  const Tag = (`h${level || 2}`) as keyof JSX.IntrinsicElements;
  const content =
    page?.title ||
    stripOuterTag(dynamicContent || saveContent || "", Tag as string);

  return (
    <Tag className={blockClasses} style={blockStyleAttr}>
      {content}
    </Tag>
  );
};

export default PostTitle;
