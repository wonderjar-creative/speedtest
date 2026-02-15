import { FrontendBlock, ContentNodeWithBlocks } from '@/types/coreBlockTypes';
import { CorePostTitleBlockAttributes } from '@/gql/graphql';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';
import { stripOuterTag } from '@/utils/htmlTransformations';

export interface CorePostTitleBlock extends FrontendBlock {
  attributes?: CorePostTitleBlockAttributes;
  page?: ContentNodeWithBlocks;
}

const PostTitle: React.FC<CorePostTitleBlock> = ({ name, attributes, dynamicContent, saveContent, page }) => {
  const { level, style } = attributes || {};
  const blockClasses = getBlockClasses(attributes || {}, getBlockBaseClass(name));
  const blockStyleAttr = getBlockStyleAttr(style || {});
  const Tag = `h${level || 2}` as keyof JSX.IntrinsicElements;
  const { title } = page || {};
  const content = title || stripOuterTag(dynamicContent || saveContent || '', Tag.toString());

  return (
    <Tag
      className={blockClasses}
      style={blockStyleAttr}
    >
      {content}
    </Tag>
  );
};

export default PostTitle;
