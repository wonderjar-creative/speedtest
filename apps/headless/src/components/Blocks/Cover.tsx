import Image from "next/image";
import type { FrontendBlock, MediaItem } from "@/types/blocks";
import {
  getBlockBaseClass,
  getBlockClasses,
  getBlockStyleAttr,
} from "@/utils/blockStyles";

interface CoverProps extends FrontendBlock {
  featuredImage?: { node: { sourceUrl: string; altText: string; mediaDetails?: { width: number; height: number } } } | null;
}

const Cover: React.FC<CoverProps> = ({
  name,
  attributes,
  featuredImage,
  mediaItem,
  innerBlocks,
}) => {
  const {
    anchor,
    alt,
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

  const Tag = (tagName || "div") as keyof JSX.IntrinsicElements;

  const effectiveDimRatio =
    dimRatio ?? (overlayColor || customOverlayColor ? 100 : undefined);

  const [vAlign, hAlign] = (contentPosition || "center center").split(" ");
  const alignMap: Record<string, string> = {
    top: "items-start",
    center: "items-center",
    bottom: "items-end",
  };
  const justifyMap: Record<string, string> = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };
  const alignClass = alignMap[vAlign] || "items-center";
  const justifyClass = justifyMap[hAlign] || "justify-center";

  const blockClasses = getBlockClasses(
    wrapperAttributes,
    `${getBlockBaseClass(name)} relative overflow-hidden ${
      !minHeight ? "min-h-[430px]" : ""
    }${isDark ? " is-dark" : " is-light"} flex ${alignClass} ${justifyClass}${
      !style?.spacing?.padding ? " p-8" : ""
    }`
  );
  const blockStyleAttr = getBlockStyleAttr({
    ...style,
    minHeight: minHeight || null,
    minHeightUnit: minHeightUnit || "px",
  });

  const overlayClasses = getBlockClasses(
    {
      backgroundColor: overlayColor,
      customGradient,
      dimRatio: effectiveDimRatio,
      gradient,
      style,
    },
    `wp-block-cover__background absolute top-0 left-0 w-full max-w-full h-full${
      !overlayColor && !customOverlayColor
        ? " has-background has-deep-black-background-color "
        : " "
    }${!effectiveDimRatio ? " opacity-50 " : ""}`
  );

  const imageClasses = getBlockClasses(
    { id, sizeSlug },
    "wp-block-cover__image-background absolute top-0 left-0 w-full max-w-full h-auto object-center object-cover"
  );

  const imageSrc =
    useFeaturedImage && featuredImage
      ? featuredImage.node.sourceUrl
      : mediaItem?.node?.sourceUrl || url || "";
  const imageAlt =
    useFeaturedImage && featuredImage
      ? featuredImage.node.altText
      : mediaItem?.node?.altText || alt || "Cover Image";
  const imageWidth =
    (useFeaturedImage && featuredImage
      ? featuredImage.node.mediaDetails?.width
      : mediaItem?.node?.mediaDetails?.width) || 1600;
  const imageHeight =
    (useFeaturedImage && featuredImage
      ? featuredImage.node.mediaDetails?.height
      : mediaItem?.node?.mediaDetails?.height) || 900;

  return (
    <Tag
      {...(anchor && { id: anchor })}
      className={blockClasses}
      {...(style && { style: blockStyleAttr })}
    >
      {imageSrc && (
        <Image
          alt={imageAlt}
          className={imageClasses}
          src={imageSrc}
          style={{ objectFit: "cover" }}
          width={imageWidth}
          height={imageHeight}
        />
      )}
      <span
        aria-hidden="true"
        className={overlayClasses}
        style={{
          ...(customGradient && { backgroundImage: customGradient }),
          ...(customOverlayColor && { backgroundColor: customOverlayColor }),
          opacity: effectiveDimRatio ? effectiveDimRatio / 100 : undefined,
        }}
      />
      <div className="wp-block-cover__inner-container relative z-10 m-0 w-full max-w-full">
        {innerBlocks}
      </div>
    </Tag>
  );
};

export default Cover;
