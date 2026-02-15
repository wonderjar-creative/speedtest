import { FrontendBlock } from '@/types/coreBlockTypes';
import { CoreParagraphBlockAttributes } from '@/gql/graphql';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';
import { stripOuterTag } from '@/utils/htmlTransformations';

export interface CoreParagraphBlock extends FrontendBlock {
  attributes?: CoreParagraphBlockAttributes;
}

const Paragraph: React.FC<CoreParagraphBlock> = ({ name, attributes, saveContent }) => {
  const { align, anchor, style, ...otherAttributes } = attributes || {};
  const blockClasses = getBlockClasses({ ...otherAttributes, textAlign: align }, getBlockBaseClass(name));
  const blockStyleAttr = getBlockStyleAttr(style);
  const html = stripOuterTag(saveContent || '', 'p');

  return (
    <p
      {...(anchor && { id: anchor })}
      className={blockClasses}
      {...(style && { style: blockStyleAttr })}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default Paragraph;
