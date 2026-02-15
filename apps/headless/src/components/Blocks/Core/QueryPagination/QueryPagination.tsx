import { FrontendBlock } from '@/types/coreBlockTypes';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';

export interface QueryPaginationBlockProps extends FrontendBlock {
  attributes?: {
    paginationArrow?: string;
    align?: string;
    layout?: {
      type?: string;
      justifyContent?: string;
    };
    style?: Record<string, any>;
    className?: string;
  };
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

const QueryPagination: React.FC<QueryPaginationBlockProps> = ({ name, attributes, innerBlocks }) => {
  const { style } = attributes || {};
  const blockClasses = getBlockClasses(attributes || {}, getBlockBaseClass(name));
  const blockStyleAttr = getBlockStyleAttr(style || {});

  return (
    <nav
      aria-label="Pagination"
      className={blockClasses}
      {...(style && { style: blockStyleAttr })}
    >
      {innerBlocks}
    </nav>
  );
};

export default QueryPagination;
