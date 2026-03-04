import { FrontendBlock } from '@/types/coreBlockTypes';
import { CoreHeadingBlockAttributes } from '@/gql/graphql';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';
import { stripOuterTag, getTransformedHtml } from '@/utils/htmlTransformations';
import { AnimatedBorder } from '@/components/Effects';

export interface CoreHeadingBlock extends FrontendBlock {
  attributes?: CoreHeadingBlockAttributes;
}

const Heading: React.FC<CoreHeadingBlock> = ({ name, attributes, saveContent }) => {
  const { anchor, className, level, style } = attributes || {};
  const blockClasses = getBlockClasses(attributes || {}, getBlockBaseClass(name));
  const blockStyleAttr = getBlockStyleAttr(style);
  const Tag = level ? `h${level}` : 'h2';
  const content = stripOuterTag(saveContent || '', Tag);
  const html = getTransformedHtml(content || '') || '';

  const animatedBorder = className?.includes('__animated-border');
  if (animatedBorder) {
    return (
      <AnimatedBorder
        {...(anchor && { id: anchor })}
        className={blockClasses}
        {...(style && { style: blockStyleAttr })}
      >
        {html}
      </AnimatedBorder>
    );
  }

  return (
    <Tag
      {...(anchor && { id: anchor })}
      className={blockClasses}
      {...(style && { style: blockStyleAttr })}
    >
      {html}
    </Tag>
  );
};

export default Heading;
