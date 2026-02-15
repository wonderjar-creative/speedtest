"use client";

import { FrontendBlock } from "@/types/coreBlockTypes";
import { CoreDetailsBlockAttributes } from "@/gql/graphql";
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from "@/utils/blockStyles";
import styles from "./Details.module.css";

export interface CoreDetailsBlock extends FrontendBlock {
  attributes?: CoreDetailsBlockAttributes;
}

const Details: React.FC<CoreDetailsBlock> = ({ name, attributes, innerBlocks, saveContent }) => {
  const { anchor, showContent, style } = attributes || {};

  const blockClasses = getBlockClasses(attributes || {}, getBlockBaseClass(name)) +
    ' transition-all duration-300 ease-in-out';
  const blockStyleAttr = getBlockStyleAttr(style);

  const getSummaryContent = () => {
    if (!saveContent) return 'Details';
    const summaryMatch = saveContent.match(/<summary>(.*?)<\/summary>/);
    if (summaryMatch && summaryMatch[1]) {
      return summaryMatch[1].trim();
    }
    return 'Details';
  };

  const summaryHtml = getSummaryContent();
  const summaryClasses = [styles.summary, 'cursor-pointer'].join(' ');

  return (
    <details
      {...(anchor ? { id: anchor } : {})}
      className={blockClasses}
      style={blockStyleAttr}
      {...(showContent ? { open: true } : {})}
    >
      <summary
        className={summaryClasses}
        dangerouslySetInnerHTML={{ __html: summaryHtml }} />
      {innerBlocks}
    </details>
  );
};

export default Details;
