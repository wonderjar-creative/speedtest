import type { JSX } from 'react';
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

  // WP computes isDark dynamically at render time; patterns often omit it.
  // Default to dark when there's an overlay with meaningful opacity.
  const effectivelyDark = isDark ?? ((overlayColor || customOverlayColor) && (dimRatio ?? 0) >= 50);

  const blockClasses = getBlockClasses(
    wrapperAttributes,
    `${getBlockBaseClass(name)}${effectivelyDark ? ' is-dark' : ' is-light'}${positionClass ? ` ${positionClass}` : ''}`
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

  // Cover blocks are full-bleed, so sizes="100vw" is always correct.
  // priority opts the image into eager-load + preload — controlled by an
  // editor-toggled attribute so the LCP candidate is explicit per page,
  // not guessed by render order. See BlockExtensionsFeature.php.
  const isPriority = Boolean((attributes as { priority?: boolean } | undefined)?.priority);
  const imagePerfProps = {
    sizes: '100vw',
    ...(isPriority && { priority: true as const }),
  };

  const image = imageSrc ? (
    useFeaturedImage && featuredImage ? (
      <Image
        alt={featuredImage?.node?.altText || 'Cover Image'}
        className={imageClasses}
        src={imageSrc}
        style={{ objectFit: 'cover' }}
        width={featuredImage?.node?.mediaDetails?.width || 1600}
        height={featuredImage?.node?.mediaDetails?.height || 900}
        {...imagePerfProps}
      />
    ) : mediaItem?.node ? (
      <Image
        alt={mediaItem.node.altText || alt || 'Cover Image'}
        className={imageClasses}
        src={imageSrc}
        style={{ objectFit: 'cover' }}
        width={mediaItem.node.mediaDetails?.width || 1600}
        height={mediaItem.node.mediaDetails?.height || 900}
        {...imagePerfProps}
      />
    ) : (
      <Image
        alt={alt || 'Cover Image'}
        className={imageClasses}
        src={imageSrc}
        style={{ objectFit: 'cover' }}
        width={1600}
        height={900}
        {...imagePerfProps}
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
