import Image from 'next/image';
import { FrontendBlock } from '@/types/coreBlockTypes';
import { CoreImageBlockAttributes } from '@/gql/graphql';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';
import { getMediaSize, getSizesAttribute } from '@/utils/mediaSizes';
import getDynamicMediaItem from '@/utils/getDynamicBlockMediaItem';

export interface CoreImageBlock extends FrontendBlock {
  attributes?: CoreImageBlockAttributes;
}

const ImageComponent: React.FC<CoreImageBlock> = ({ name, attributes, mediaItem, saveContent, dynamicContent }) => {
  const { url, align, alt, anchor, aspectRatio, style, width, height, scale, sizeSlug, ...imageAttributes } = attributes || {};
  const { sizes } = mediaItem?.node?.mediaDetails || {};
  const isPriority = Boolean((attributes as { priority?: boolean } | undefined)?.priority);

  const blockClasses = getBlockClasses(attributes || {}, `${getBlockBaseClass(name)} ${width || height ? 'is-resized' : '' }`);
  const blockStyleAttr = getBlockStyleAttr(style);
  const imageClasses = getBlockClasses(imageAttributes, 'wp-image');

  const sizeObj = getMediaSize(sizeSlug, sizes);
  let imageSrc = sizeObj?.sourceUrl || url || mediaItem?.node?.sourceUrl || '';
  let imageWidth = sizeObj?.width || mediaItem?.node?.mediaDetails?.width || 0;
  let imageHeight = sizeObj?.height || mediaItem?.node?.mediaDetails?.height || 0;

  // Fallback: extract image from dynamicContent or saveContent HTML
  if (!imageSrc) {
    const fallback = getDynamicMediaItem(dynamicContent) || getDynamicMediaItem(saveContent);
    if (fallback?.node) {
      imageSrc = fallback.node.sourceUrl || '';
      imageWidth = imageWidth || fallback.node.mediaDetails?.width || 0;
      imageHeight = imageHeight || fallback.node.mediaDetails?.height || 0;
    }
  }

  if (!imageSrc) return null;

  const useFill = !imageWidth && !imageHeight;
  const fillHeight = useFill && width && !height ? width : '300px';

  return (
    <figure
      {...(anchor && { id: anchor })}
      className={blockClasses}
      style={{
        ...blockStyleAttr,
        ...(useFill && { position: 'relative' as const, width: width || '100%', height: height || fillHeight })
      }}
    >
      <Image
        src={imageSrc}
        alt={alt || ''}
        {...(useFill ? { fill: true } : { width: imageWidth, height: imageHeight })}
        sizes={useFill ? '100vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        {...(isPriority && { priority: true as const })}
        className={imageClasses}
        style={{
          ...aspectRatio && { aspectRatio: `${aspectRatio}` },
          objectFit: scale === 'contain' ? 'contain' : 'cover',
          ...(!useFill && width && { width: `${width}` }),
          ...(!useFill && height && { height: `${height}` })
        }}
      />
    </figure>
  );
};

export default ImageComponent;
