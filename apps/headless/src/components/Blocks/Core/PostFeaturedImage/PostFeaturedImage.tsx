import Image from 'next/image';
import Link from 'next/link';
import { FrontendBlock } from '@/types/coreBlockTypes';
import { Maybe, NodeWithFeaturedImageToMediaItemConnectionEdge } from '@/gql/graphql';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';

interface PostFeaturedImageAttributes {
  isLink?: boolean;
  aspectRatio?: string;
  width?: string | number;
  height?: string | number;
  scale?: 'cover' | 'contain';
  priority?: boolean;
  style?: Record<string, unknown>;
  className?: string;
  align?: string;
}

export interface CorePostFeaturedImageBlock extends FrontendBlock {
  attributes?: PostFeaturedImageAttributes;
  featuredImage?: Maybe<NodeWithFeaturedImageToMediaItemConnectionEdge>;
  postUri?: string;
  postTitle?: string;
}

const PostFeaturedImage: React.FC<CorePostFeaturedImageBlock> = ({
  name,
  attributes,
  featuredImage,
  postUri,
  postTitle,
}) => {
  const node = featuredImage?.node;
  if (!node?.sourceUrl) return null;

  const { isLink, aspectRatio, scale, priority, style, ...wrapperAttributes } = attributes || {};

  const figureClasses = getBlockClasses(wrapperAttributes, getBlockBaseClass(name));
  const figureStyle = {
    ...(style ? getBlockStyleAttr(style) : {}),
    ...(aspectRatio ? { aspectRatio } : {}),
  };

  const imgWidth = node.mediaDetails?.width || 1600;
  const imgHeight = node.mediaDetails?.height || 900;

  const img = (
    <Image
      src={node.sourceUrl}
      alt={node.altText || postTitle || ''}
      width={imgWidth}
      height={imgHeight}
      sizes="100vw"
      {...(priority && { priority: true as const, quality: 70 })}
      className="wp-block-post-featured-image__image"
      style={{
        width: '100%',
        height: aspectRatio ? '100%' : 'auto',
        objectFit: scale === 'contain' ? 'contain' : 'cover',
        ...(aspectRatio && { aspectRatio }),
      }}
    />
  );

  return (
    <figure className={figureClasses} style={figureStyle}>
      {isLink && postUri ? <Link href={postUri}>{img}</Link> : img}
    </figure>
  );
};

export default PostFeaturedImage;
