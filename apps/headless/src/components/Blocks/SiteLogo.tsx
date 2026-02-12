import Image from "next/image";
import type { FrontendBlock } from "@/types/blocks";
import {
  getBlockBaseClass,
  getBlockClasses,
  getBlockStyleAttr,
} from "@/utils/blockStyles";

const SiteLogo: React.FC<FrontendBlock> = ({
  attributes,
  dynamicContent,
  mediaItem,
}) => {
  const { width } = attributes || {};
  const blockClasses = getBlockClasses(
    attributes || {},
    getBlockBaseClass("core/site-logo")
  );
  const blockStyleAttr = getBlockStyleAttr(attributes?.style);

  // Try to extract image from dynamic content or mediaItem
  const src = mediaItem?.node?.sourceUrl || "";
  const alt = mediaItem?.node?.altText || "Site Logo";
  const logoWidth = width ?? 120;
  const logoHeight = mediaItem?.node?.mediaDetails?.height
    ? Math.round(
        (logoWidth / (mediaItem.node.mediaDetails.width || logoWidth)) *
          mediaItem.node.mediaDetails.height
      )
    : 40;

  if (!src && dynamicContent) {
    // Fallback: render dynamic HTML
    return (
      <div
        className={blockClasses}
        style={blockStyleAttr}
        dangerouslySetInnerHTML={{ __html: dynamicContent }}
      />
    );
  }

  if (!src) {
    return (
      <div className={blockClasses} style={blockStyleAttr} />
    );
  }

  return (
    <div className={blockClasses} style={blockStyleAttr}>
      <a href="/" className="wp-block-site-logo__link" rel="home">
        <Image
          src={src}
          alt={alt}
          width={logoWidth}
          height={logoHeight}
          priority
        />
      </a>
    </div>
  );
};

export default SiteLogo;
