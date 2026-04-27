import type { JSX } from 'react';
import { FrontendBlock } from '@/types/coreBlockTypes';
import { CoreSiteTitleBlockAttributes } from '@/gql/graphql';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';
import { stripOuterTag } from '@/utils/htmlTransformations';

export interface CoreSiteTitleBlock extends FrontendBlock {
  attributes?: CoreSiteTitleBlockAttributes;
}

const SiteTitle: React.FC<CoreSiteTitleBlock> = ({ name, attributes, isDynamic, dynamicContent, saveContent }) => {
  const { level, style } = attributes || {};
  const blockClasses = getBlockClasses(attributes || {}, getBlockBaseClass(name));
  const blockStyleAttr = getBlockStyleAttr(style || {});
  const Tag = level ? `h${level}` : 'h1';
  const TagComponent = Tag as keyof JSX.IntrinsicElements;
  const content = dynamicContent || saveContent;
  const html = stripOuterTag(content || '', Tag);

  return (
    <TagComponent
      className={blockClasses}
      style={blockStyleAttr}
      dangerouslySetInnerHTML={{ __html: html || '' }}
    />
  );
};

export default SiteTitle;
