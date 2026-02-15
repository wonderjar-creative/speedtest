import { CoreSeparatorBlockAttributes } from '@/gql/graphql';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';

export interface CoreSeparatorBlock {
  name: string;
  attributes?: CoreSeparatorBlockAttributes;
}

const Separator: React.FC<CoreSeparatorBlock> = ({ name, attributes }) => {
  const { anchor, style, ...separatorAttributes } = attributes || {};
  let blockClasses = getBlockClasses(separatorAttributes, getBlockBaseClass(name));
  const blockStyleAttr = getBlockStyleAttr(style);

  if (blockClasses?.includes('has-background')) {
    const backgroundColorClass = blockClasses
      .split(' ')
      .find((cls) => cls.startsWith('has-') && cls.endsWith('-background-color'));

    if (backgroundColorClass) {
      const colorClass = backgroundColorClass.replace('-background-color', '-color');
      blockClasses = blockClasses
        .replace(backgroundColorClass, colorClass)
        .replace('has-background', 'has-text-color');
    }
  }

  if (blockStyleAttr?.background && !blockStyleAttr.color) {
    blockStyleAttr.color = blockStyleAttr.background as string;
    delete blockStyleAttr.background;
  }

  return (
    <hr
      {...(anchor && { id: anchor })}
      className={blockClasses}
      {...(blockStyleAttr && { style: blockStyleAttr })}
    />
  );
};

export default Separator;
