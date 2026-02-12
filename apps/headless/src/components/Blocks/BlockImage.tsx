import Image from "next/image";
import type { FrontendBlock } from "@/types/blocks";
import {
  getBlockBaseClass,
  getBlockClasses,
  getBlockStyleAttr,
} from "@/utils/blockStyles";

const BlockImage: React.FC<FrontendBlock> = ({ name, attributes, mediaItem }) => {
  const {
    url,
    align,
    alt,
    anchor,
    aspectRatio,
    style,
    width,
    height,
    scale,
    sizeSlug,
    ...imageAttributes
  } = attributes || {};

  const blockClasses = getBlockClasses(
    attributes || {},
    `${getBlockBaseClass(name)} ${width || height ? "is-resized" : ""}`
  );
  const blockStyleAttr = getBlockStyleAttr(style);
  const imageClasses = getBlockClasses(
    imageAttributes,
    `wp-image ${align === "center" ? "mx-auto" : ""}`
  );

  const imageSrc = url || mediaItem?.node?.sourceUrl || "";
  const imageWidth = mediaItem?.node?.mediaDetails?.width || 0;
  const imageHeight = mediaItem?.node?.mediaDetails?.height || 0;
  const useFill = !imageWidth && !imageHeight;

  if (!imageSrc) return null;

  return (
    <figure
      {...(anchor && { id: anchor })}
      className={blockClasses}
      style={{
        ...blockStyleAttr,
        ...(useFill && {
          position: "relative" as const,
          width: width || "100%",
          height: height || "300px",
        }),
      }}
    >
      <Image
        src={imageSrc}
        alt={alt || ""}
        {...(useFill ? { fill: true } : { width: imageWidth, height: imageHeight })}
        className={imageClasses}
        style={{
          ...(aspectRatio && { aspectRatio: `${aspectRatio}` }),
          objectFit: scale === "contain" ? "contain" : "cover",
          ...(!useFill && width && { width: `${width}` }),
          ...(!useFill && height && { height: `${height}` }),
        }}
      />
    </figure>
  );
};

export default BlockImage;
