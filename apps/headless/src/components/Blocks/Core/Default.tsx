import type { JSX } from 'react';
import { FrontendBlock } from '@/types/coreBlockTypes';
import { getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';

const Default: React.FC<FrontendBlock> = ({ attributes, dynamicContent, saveContent, innerBlocks }) => {
  const { anchor, style, tagName } = attributes || {};
  const blockClasses = getBlockClasses(attributes || {}, 'wp-block-default');
  const blockStyleAttr = getBlockStyleAttr(style);
  const Tag = tagName || 'div';
  const TagComponent = Tag as keyof JSX.IntrinsicElements;
  const hasInnerBlocks = Array.isArray(innerBlocks) && innerBlocks.length > 0;
  const html = dynamicContent || saveContent || '';

  if (hasInnerBlocks) {
    return (
      <TagComponent
        {...(anchor && { id: anchor })}
        className={blockClasses}
        {...(style && { style: blockStyleAttr })}
      >
        {innerBlocks}
      </TagComponent>
    );
  }

  if (html) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return null;
}

export default Default;
