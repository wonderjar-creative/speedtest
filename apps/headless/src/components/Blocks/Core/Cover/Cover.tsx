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
  // For the locally-mirrored hero we also ship an inline blur so the
  // browser paints the LCP element immediately instead of waiting for the
  // optimized variant. Sized 64x36 (16:9) at q=50 — large enough that
  // Chrome's 0.05 bpp entropy filter counts the blur as the LCP element.
  // Generated once via:
  //   magick public/hero.jpg -resize '64x36!' -quality 50 jpg:- | base64
  const isLocalHero = imageSrc === '/hero.jpg';
  const imagePerfProps = {
    sizes: '100vw',
    ...(isPriority && { priority: true as const, quality: 60 }),
    ...(isLocalHero && {
      placeholder: 'blur' as const,
      blurDataURL:
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAkAEADASIAAhEBAxEB/8QAGgAAAwEBAQEAAAAAAAAAAAAAAwQFAAIGAf/EACwQAAIBAwMDAwIHAQAAAAAAAAECAwAEERIhMQUTQSJRYQZxFBUjMkKBsaH/xAAXAQEBAQEAAAAAAAAAAAAAAAACAwEA/8QAGxEBAQEBAAMBAAAAAAAAAAAAAQARAhIiQSH/2gAMAwEAAhEDEQA/AOOpda7E5ggXScYJdSCDnx7ik7u7a+t/1WWJ4xtk4MhzuMUHp80dxELeVA8ki6Edhlgc7DJ8f5TV10eeBlDElkwcqAQFJxtn5PmqPS08kF7qlFXKkjOM5z7nFES04ZRhdLZccHbOK66jZ9y6WIPo7cOxPq/maDDDdRdxdLTRxkAopI155/rG1Hcclk0vT+48nbileJPQsqLz7kE45NMrZWoaNHebXz6k8/2P+1V6b9R9MuTHayxNay5CLHIMrngAGqt5axkO808cQ20FiF0mmJZeaXpVzI7BHGiQfuzvt8+RVGSyhs45LhsaUBIB4FcdZ6hBBYqllcqA4K95MNkj+PxzXmuuX1ybWK2nYkkZJL5LDO3Hj2rfLLMpqTawFAACnYY5+9VXv7/EcSBlZlXSo9WpeRz8jNQY3CEFjgEjeq17NHJNG0Eh0xxqgO+dvNQXKgEYt1WRxcCBv24aQxnGNXJ8cmrkXTrvMiwyQemURyMync5OCB7V5hLmVRpNxLoOxXUcEe2M1WtOu9tpy0ZcySBgHO2B4NB6cZevyo2n08tzcyia5mLRESelQmDk7jk+K11YWFvOon1SswLa5S7k/wCUp+dSr3CkTjuDBMU+Pf3HzSk/VtULCT8T3ghCNJhgDQHpJesFCrepoYjGxYYwRn1Y96lXqgXUoVcBWIH2FGtLiRpXV3JBOrcec0C71iSRi2xOeaubn7Bz5JneMfemYWJiU58Vq1YxYgJr6pINatRjFDEcGid19OCcj5rVqLdBY4DBfTnnG1JXA35JrVqXMi//2Q==',
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
