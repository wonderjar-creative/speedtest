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
  const blockClasses = getBlockClasses(attributes || {}, getBlockBaseClass(name));
  const blockStyleAttr = getBlockStyleAttr(style || {});

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <ul
      className={blockClasses}
      {...(style && { style: blockStyleAttr })}
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
