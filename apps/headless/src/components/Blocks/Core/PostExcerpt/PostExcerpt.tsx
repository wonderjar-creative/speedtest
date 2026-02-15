import { FrontendBlock } from '@/types/coreBlockTypes';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';
import { PostNode } from '../Query/Query';
import Link from 'next/link';

export interface PostExcerptBlockProps extends FrontendBlock {
  attributes?: {
    moreText?: string;
    showMoreOnNewLine?: boolean;
    excerptLength?: number;
    style?: Record<string, any>;
    className?: string;
  };
  post?: PostNode;
}

const PostExcerpt: React.FC<PostExcerptBlockProps> = ({ name, attributes, post }) => {
  const { moreText, showMoreOnNewLine, excerptLength, style } = attributes || {};
  const blockClasses = getBlockClasses(attributes || {}, getBlockBaseClass(name));
  const blockStyleAttr = getBlockStyleAttr(style || {});

  if (!post) {
    return null;
  }

  const rawExcerpt = post.excerpt?.replace(/<[^>]*>/g, '') || '';
  const words = rawExcerpt.split(/\s+/);
  const truncatedExcerpt = excerptLength && words.length > excerptLength
    ? words.slice(0, excerptLength).join(' ') + '...'
    : rawExcerpt;

  return (
    <div
      className={blockClasses}
      {...(style && { style: blockStyleAttr })}
    >
      <p>{truncatedExcerpt}</p>
      {moreText && (
        <p className="wp-block-post-excerpt__more-text">
          <Link href={post.uri}>{moreText}</Link>
        </p>
      )}
    </div>
  );
};

export default PostExcerpt;
