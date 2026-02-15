import Image from 'next/image';
import { FrontendBlock } from '@/types/coreBlockTypes';
import { CoreCoverBlockAttributes, Maybe, NodeWithFeaturedImageToMediaItemConnectionEdge } from '@/gql/graphql';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';

export interface CoreCoverBlock extends FrontendBlock {
  attributes?: CoreCoverBlockAttributes;
  featuredImage?: Maybe<NodeWithFeaturedImageToMediaItemConnectionEdge>;
}

const Cover: React.FC<CoreCoverBlock> = ({ name, attributes, featuredImage, mediaItem, innerBlocks }) => {
  const {
    anchor,
    alt,
    backgroundType,
    contentPosition,
    customGradient,
    customOverlayColor,
    dimRatio,
    gradient,
    id,
    isDark,
    minHeight,
    minHeightUnit,
    overlayColor,
    sizeSlug,
    style,
    tagName,
    url,
    useFeaturedImage,
    ...wrapperAttributes
  } = attributes || {};

  const Tag = tagName || 'div';
  const TagComponent = Tag as keyof JSX.IntrinsicElements;

  const effectiveDimRatio = dimRatio ?? (overlayColor || customOverlayColor ? 100 : undefined);
  const customCombinedGradientOverlayColor = customGradient ? customGradient : customOverlayColor

  const align = contentPosition ? [contentPosition.split(' ')[0]].map((verticalAlign) => {
    switch (verticalAlign) {
      case 'top': return 'items-start';
      case 'center': return 'items-center';
      case 'bottom': return 'items-end';
      default: return 'items-center';
    }
  }).join(' ') : 'items-center';

  const justify = contentPosition ? [contentPosition.split(' ')[1]].map((horizontalAlign) => {
    switch (horizontalAlign) {
      case 'left': return 'justify-start';
      case 'center': return 'justify-center';
      case 'right': return 'justify-end';
      default: return 'justify-center';
    }
  }).join(' ') : 'justify-center';

  const blockClasses = getBlockClasses(
    wrapperAttributes,
    `${getBlockBaseClass(name)} relative overflow-hidden ${!minHeight ? 'min-h-[430px]' : ''}${isDark ? ' is-dark' : ' is-light'} flex ${align} ${justify}${!style?.spacing?.padding ? ' p-8' : ''}`
  );
  const blockStyleAttr = getBlockStyleAttr({
    ...style,
    minHeight: minHeight || null,
    minHeightUnit: minHeightUnit || 'px',
  });

  const backgroundColor = overlayColor;
  const overlayClasses = getBlockClasses(
    { backgroundColor, customGradient, dimRatio: effectiveDimRatio, gradient, style },
    `wp-block-cover__background absolute top-0 left-0 w-full max-w-full h-full${!backgroundColor && !customOverlayColor ? ' has-background has-deep-black-background-color ' : ' '}${!effectiveDimRatio ? ' opacity-50 ' : ''}`
  );

  const imageClasses = getBlockClasses(
    { id, sizeSlug },
    'wp-block-cover__image-background absolute top-0 left-0 w-full max-w-full h-auto object-center object-cover'
  );

  const innerContainerClasses = getBlockClasses(
    {},
    `wp-block-cover__inner-container relative z-10 m-0 w-full max-w-full`
  );

  const image = useFeaturedImage && featuredImage ? (
    <Image
      alt={featuredImage?.node?.altText || 'Cover Image'}
      className={imageClasses}
      src={featuredImage?.node?.sourceUrl || ''}
      style={{ objectFit: 'cover' }}
      width={featuredImage?.node?.mediaDetails?.width || 1600}
      height={featuredImage?.node?.mediaDetails?.height || 900}
    />
  ) : mediaItem?.node ? (
    <Image
      alt={mediaItem.node.altText || alt || 'Cover Image'}
      className={imageClasses}
      src={mediaItem.node.sourceUrl || url || ''}
      style={{ objectFit: 'cover' }}
      width={mediaItem.node.mediaDetails?.width || 1600}
      height={mediaItem.node.mediaDetails?.height || 900}
    />
  ) : (
    <Image
      alt={alt || 'Cover Image'}
      className={imageClasses}
      src={url || ''}
      style={{ objectFit: 'cover' }}
      width={1600}
      height={900}
    />
  );

  return (
    <TagComponent
      {...(anchor && { id: anchor })}
      className={blockClasses}
      {...(style && { style: blockStyleAttr })}
    >
      {url || useFeaturedImage ? image : null}
      <span
        aria-hidden="true"
        className={overlayClasses}
        style={{
          ...(customCombinedGradientOverlayColor && { backgroundImage: customGradient ? customGradient : undefined }),
          ...(customOverlayColor && { backgroundColor: customOverlayColor }),
          opacity: effectiveDimRatio ? effectiveDimRatio / 100 : undefined,
        }}
      ></span>
      <div className={innerContainerClasses}>
        {innerBlocks}
      </div>
    </TagComponent>
  );
}

export default Cover;
