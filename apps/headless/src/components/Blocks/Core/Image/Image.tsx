import Image from 'next/image';
import { FrontendBlock } from '@/types/coreBlockTypes';
import { CoreImageBlockAttributes } from '@/gql/graphql';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';
import { getMediaSize, getSizesAttribute } from '@/utils/mediaSizes';

export interface CoreImageBlock extends FrontendBlock {
  attributes?: CoreImageBlockAttributes;
}

const ImageComponent: React.FC<CoreImageBlock> = ({ name, attributes, mediaItem }) => {
  const { url, align, alt, anchor, aspectRatio, style, width, height, scale, sizeSlug, ...imageAttributes } = attributes || {};
  const { sizes } = mediaItem?.node?.mediaDetails || {};

  const blockClasses = getBlockClasses(attributes || {}, `${getBlockBaseClass(name)} ${width || height ? 'is-resized' : '' }`);
  const blockStyleAttr = getBlockStyleAttr(style);
  const imageClasses = getBlockClasses(imageAttributes, `wp-image ${align === 'center' ? 'mx-auto' : ''}`);

  const sizeObj = getMediaSize(sizeSlug, sizes);
  const imageSrc = sizeObj?.sourceUrl || url || mediaItem?.node?.sourceUrl || '';
  const imageWidth = sizeObj?.width || mediaItem?.node?.mediaDetails?.width || 0;
  const imageHeight = sizeObj?.height || mediaItem?.node?.mediaDetails?.height || 0;

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
