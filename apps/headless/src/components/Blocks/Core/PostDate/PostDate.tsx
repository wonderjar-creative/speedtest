import { FrontendBlock } from '@/types/coreBlockTypes';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';
import { PostNode } from '../Query/Query';

export interface PostDateBlockProps extends FrontendBlock {
  attributes?: {
    format?: string;
    isLink?: boolean;
    style?: Record<string, any>;
    className?: string;
    textColor?: string;
  };
  post?: PostNode;
}

const PostDate: React.FC<PostDateBlockProps> = ({ name, attributes, post }) => {
  const { format, style } = attributes || {};
  const blockClasses = getBlockClasses(attributes || {}, getBlockBaseClass(name));
  const blockStyleAttr = getBlockStyleAttr(style || {});

  if (!post?.date) {
    return null;
  }

  const dateObj = new Date(post.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <time
      className={blockClasses}
      dateTime={post.date}
      {...(style && { style: blockStyleAttr })}
    >
      {formattedDate}
    </time>
  );
};

export default PostDate;
