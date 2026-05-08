import { FrontendBlock } from '@/types/coreBlockTypes';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';
import { PostNode } from '../Query/Query';
import React from 'react';

export interface PostTemplateBlockProps extends FrontendBlock {
  attributes?: {
    layout?: {
      type?: string;
      columnCount?: number;
    };
    style?: Record<string, any>;
    className?: string;
  };
  posts?: PostNode[];
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

const PostTemplate: React.FC<PostTemplateBlockProps> = ({ name, attributes, innerBlocks, posts }) => {
  const { style, layout } = attributes || {};
  const baseClasses = getBlockClasses(attributes || {}, getBlockBaseClass(name));
  const blockStyleAttr: React.CSSProperties = { ...getBlockStyleAttr(style || {}) };

  const isGrid = layout?.type === 'grid' && !!layout?.columnCount;
  if (isGrid) {
    blockStyleAttr.gridTemplateColumns = `repeat(${layout!.columnCount}, 1fr)`;
  }
  const blockGap = style?.spacing?.blockGap;
  if (blockGap) {
    blockStyleAttr.gap = typeof blockGap === 'string' && blockGap.startsWith('var:')
      ? `var(--wp--${blockGap.slice(4).replace(/\|/g, '--')})`
      : blockGap;
  }

  const blockClasses = [baseClasses, isGrid && 'is-layout-grid'].filter(Boolean).join(' ');

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <ul
      className={blockClasses}
      {...(Object.keys(blockStyleAttr).length > 0 && { style: blockStyleAttr })}
    >
      {posts.map((post) => (
        <li key={post.id}>
          {React.Children.map(innerBlocks, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<any>, { post });
            }
            return child;
          })}
        </li>
      ))}
    </ul>
  );
};

export default PostTemplate;
