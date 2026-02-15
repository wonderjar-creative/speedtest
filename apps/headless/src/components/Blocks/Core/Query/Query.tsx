import { FrontendBlock } from '@/types/coreBlockTypes';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import { PostsQuery } from '@/queries/general/PostsQuery';
import { print } from 'graphql';
import React from 'react';

export interface PostNode {
  id: string;
  databaseId: number;
  title: string;
  excerpt: string;
  date: string;
  uri: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
}

interface PostsQueryResult {
  posts: {
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
    nodes: PostNode[];
  };
}

export interface QueryBlockProps extends FrontendBlock {
  attributes?: {
    queryId?: number;
    query?: {
      perPage?: number;
      pages?: number;
      offset?: number;
      postType?: string;
      order?: string;
      orderBy?: string;
      inherit?: boolean;
    };
    align?: string;
    className?: string;
    style?: Record<string, any>;
  };
}

const Query: React.FC<QueryBlockProps> = async ({ name, attributes, innerBlocks }) => {
  const { query, style } = attributes || {};
  const perPage = query?.perPage || 10;
  const blockClasses = getBlockClasses(attributes || {}, getBlockBaseClass(name));
  const blockStyleAttr = getBlockStyleAttr(style || {});

  let posts: PostNode[] = [];
  let pageInfo = null;

  try {
    const result = await fetchGraphQL<PostsQueryResult>(
      print(PostsQuery),
      { first: perPage }
    );
    posts = result.posts?.nodes || [];
    pageInfo = result.posts?.pageInfo || null;
  } catch (error) {
    console.error('Error fetching posts for Query block:', error);
  }

  const childrenWithPosts = React.Children.map(innerBlocks, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, { posts, pageInfo });
    }
    return child;
  });

  return (
    <div
      className={blockClasses}
      {...(style && { style: blockStyleAttr })}
    >
      {childrenWithPosts}
    </div>
  );
};

export default Query;
