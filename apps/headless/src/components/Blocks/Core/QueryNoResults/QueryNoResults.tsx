import { FrontendBlock } from '@/types/coreBlockTypes';
import { getBlockBaseClass, getBlockClasses } from '@/utils/blockStyles';
import { PostNode } from '../Query/Query';

export interface QueryNoResultsBlockProps extends FrontendBlock {
  posts?: PostNode[];
}

const QueryNoResults: React.FC<QueryNoResultsBlockProps> = ({ name, attributes, innerBlocks, posts }) => {
  const blockClasses = getBlockClasses(attributes || {}, getBlockBaseClass(name));

  if (posts && posts.length > 0) {
    return null;
  }

  return (
    <div className={blockClasses}>
      {innerBlocks}
    </div>
  );
};

export default QueryNoResults;
