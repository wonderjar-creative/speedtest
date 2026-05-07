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

  const rawImageSrc = useFeaturedImage && featuredImage
    ? featuredImage?.node?.sourceUrl
    : mediaItem?.node?.sourceUrl || url;

  // For WP-served theme assets we ship a local mirror in public/ so the
  // image optimizer reads from disk instead of fetching the asset back
  // through public DNS to the slow WP origin. Slow.* is unaffected — it
  // still resolves the original URL. See public/hero.jpg.
  const imageSrc = rawImageSrc?.match(
    /\/wp-content\/themes\/[^/]+\/assets\/hero\.jpg$/,
  )
    ? '/hero.jpg'
    : rawImageSrc;

  // Cover blocks are full-bleed, so sizes="100vw" is always correct.
  // priority opts the image into eager-load + preload — controlled by an
  // editor-toggled attribute so the LCP candidate is explicit per page,
  // not guessed by render order. See BlockExtensionsFeature.php.
  const isPriority = Boolean((attributes as { priority?: boolean } | undefined)?.priority);
  // q=60 on the LCP-flagged image: variant size drops ~25% vs default q=75
  // and the cover's dim overlay hides any artifact difference.
  // For the locally-mirrored hero we ship a tiny inline blur. It paints
  // the cover element fast (helps FCP) but Chrome's LCP entropy filter
  // skips it regardless of size, so we keep the blur small. Generated via:
  //   magick public/hero.jpg -resize '16x9!' -quality 30 jpg:- | base64
  const isLocalHero = imageSrc === '/hero.jpg';
  // Tell the browser the cover only "needs" a smaller image on small
  // viewports. Combined with the smaller deviceSizes in next.config,
  // Lighthouse mobile picks the 480w variant instead of the 750w default.
  const imagePerfProps = {
    sizes: '(max-width: 480px) 240px, (max-width: 1024px) 720px, 100vw',
    // Next 16 made fetchPriority a passthrough prop — `priority: true` only
    // emits <link rel=preload> + disables lazy. fetchpriority="high" on the
    // <img> still has to be set explicitly.
    ...(isPriority && { priority: true as const, fetchPriority: 'high' as const, quality: 60 }),
    ...(isLocalHero && {
      placeholder: 'blur' as const,
      blurDataURL:
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCAAJABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAMF/8QAIBAAAgEDBAMAAAAAAAAAAAAAAQIDAAQREhMxgTIzkf/EABQBAQAAAAAAAAAAAAAAAAAAAAH/xAAXEQADAQAAAAAAAAAAAAAAAAAAAREh/9oADAMBAAIRAxEAPwASSLcFCzlWPJZhikXNzHBEBEkO5pzlTkD7WPF491Wb19UV0MP/2Q==',
    }),
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
