import type { FrontendBlock } from "@/types/blocks";
import { stripOuterTag } from "@/utils/htmlTransformations";

const ListItem: React.FC<FrontendBlock> = ({
  innerBlocks,
  saveContent,
  dynamicContent,
}) => {
  const content = dynamicContent || saveContent;

  if (!content && !innerBlocks) return null;

  if (content) {
    const strippedContent = stripOuterTag(content, "li");
    return <li dangerouslySetInnerHTML={{ __html: strippedContent }} />;
  }

  return <li>{innerBlocks}</li>;
};

export default ListItem;
