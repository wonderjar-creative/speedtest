import type { FrontendBlock } from "@/types/blocks";

const List: React.FC<FrontendBlock> = ({ attributes, innerBlocks }) => {
  const { ordered = false } = attributes || {};
  const Tag = ordered ? "ol" : "ul";
  return <Tag>{innerBlocks}</Tag>;
};

export default List;
