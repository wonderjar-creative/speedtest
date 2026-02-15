import Image from 'next/image';
import { FrontendBlock } from '@/types/coreBlockTypes';
import { CoreSiteLogoBlockAttributes } from '@/gql/graphql';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';
import { getMediaSize, getSizesAttribute } from '@/utils/mediaSizes';
import getDynamicMediaItem from '@/utils/getDynamicBlockMediaItem';

export interface CoreSiteLogoBlock extends FrontendBlock {
  attributes?: CoreSiteLogoBlockAttributes;
}

const SiteLogo: React.FC<CoreSiteLogoBlock> = ({
  attributes,
  isDynamic,
  dynamicContent,
  saveContent,
  mediaItem
}) => {
  const { width } = attributes || {};

  if (isDynamic && dynamicContent && !mediaItem) {
    const dynamicMediaItem = getDynamicMediaItem(dynamicContent);

    if (dynamicMediaItem?.node?.sourceUrl) {
      const dynamicWidth = dynamicMediaItem.node.mediaDetails?.width || 1350;
      const dynamicHeight = dynamicMediaItem.node.mediaDetails?.height || 490;
      const aspectRatio = dynamicHeight / dynamicWidth;
      const calculatedHeight = Math.round(width ?? 120 * aspectRatio);

      const blockClasses = getBlockClasses(attributes || {}, getBlockBaseClass('core-site-logo'));
      const blockStyleAttr = getBlockStyleAttr(attributes?.style);

      const Logo = () => (
        <Image
          src={dynamicMediaItem.node.sourceUrl || ''}
          alt={dynamicMediaItem.node.altText || ''}
          width={width ?? 120}
          height={calculatedHeight}
          priority
        />
      );

      return (
        <div className={blockClasses} style={blockStyleAttr}>
          <a href="/" className="wp-block-site-logo__link" rel="home">
            <Logo />
          </a>
        </div>
      );
    }
  }

  return (
    <div
      className={getBlockClasses(attributes ?? {}, getBlockBaseClass('core-site-logo'))}
      style={getBlockStyleAttr(attributes?.style)}
    >
      {/* Fallback content */}
    </div>
  );
};

export default SiteLogo;
