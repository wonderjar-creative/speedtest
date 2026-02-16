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

  const positionSlug = contentPosition ? contentPosition.replace(/\s+/g, '-') : '';
  const positionClass = positionSlug && positionSlug !== 'center-center'
    ? `has-custom-content-position is-position-${positionSlug}`
    : '';

  const blockClasses = getBlockClasses(
    wrapperAttributes,
    `${getBlockBaseClass(name)}${isDark ? ' is-dark' : ' is-light'}${positionClass ? ` ${positionClass}` : ''}`
  );
  const blockStyleAttr = getBlockStyleAttr({
    ...style,
    minHeight: minHeight || null,
    minHeightUnit: minHeightUnit || 'px',
  });

  const backgroundColor = overlayColor;
  const overlayClasses = getBlockClasses(
    { backgroundColor, customGradient, dimRatio: effectiveDimRatio, gradient, style },
    `wp-block-cover__background${!backgroundColor && !customOverlayColor ? ' has-background has-deep-black-background-color' : ''}`
  );

  const imageClasses = getBlockClasses(
    { id, sizeSlug },
    'wp-block-cover__image-background'
  );

  const innerContainerClasses = 'wp-block-cover__inner-container';

  const imageSrc = useFeaturedImage && featuredImage
    ? featuredImage?.node?.sourceUrl
    : mediaItem?.node?.sourceUrl || url;

  const image = imageSrc ? (
    useFeaturedImage && featuredImage ? (
      <Image
        alt={featuredImage?.node?.altText || 'Cover Image'}
        className={imageClasses}
        src={imageSrc}
        style={{ objectFit: 'cover' }}
        width={featuredImage?.node?.mediaDetails?.width || 1600}
        height={featuredImage?.node?.mediaDetails?.height || 900}
      />
    ) : mediaItem?.node ? (
      <Image
        alt={mediaItem.node.altText || alt || 'Cover Image'}
        className={imageClasses}
        src={imageSrc}
        style={{ objectFit: 'cover' }}
        width={mediaItem.node.mediaDetails?.width || 1600}
        height={mediaItem.node.mediaDetails?.height || 900}
      />
    ) : (
      <Image
        alt={alt || 'Cover Image'}
        className={imageClasses}
        src={imageSrc}
        style={{ objectFit: 'cover' }}
        width={1600}
        height={900}
      />
    )
  ) : null;

  return (
    <TagComponent
      {...(anchor && { id: anchor })}
      className={blockClasses}
      {...(style && { style: blockStyleAttr })}
    >
      {image}
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
