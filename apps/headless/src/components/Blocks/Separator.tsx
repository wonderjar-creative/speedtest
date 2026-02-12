import type { FrontendBlock } from "@/types/blocks";
import {
  getBlockBaseClass,
  getBlockClasses,
  getBlockStyleAttr,
} from "@/utils/blockStyles";

const Separator: React.FC<FrontendBlock> = ({ name, attributes }) => {
  const { anchor, style, ...separatorAttributes } = attributes || {};
  let blockClasses = getBlockClasses(separatorAttributes, getBlockBaseClass(name));
  const blockStyleAttr = getBlockStyleAttr(style) as Record<string, any>;

  // Separator uses background-color for line color — convert to text color class
  if (blockClasses?.includes("has-background")) {
    const bgClass = blockClasses
      .split(" ")
      .find((cls) => cls.startsWith("has-") && cls.endsWith("-background-color"));
    if (bgClass) {
      blockClasses = blockClasses
        .replace(bgClass, bgClass.replace("-background-color", "-color"))
        .replace("has-background", "has-text-color");
    }
  }

  if (blockStyleAttr?.background && !blockStyleAttr.color) {
    blockStyleAttr.color = blockStyleAttr.background;
    delete blockStyleAttr.background;
  }

  return (
    <hr
      {...(anchor && { id: anchor })}
      className={blockClasses}
      {...(Object.keys(blockStyleAttr).length > 0 && { style: blockStyleAttr })}
    />
  );
};

export default Separator;
