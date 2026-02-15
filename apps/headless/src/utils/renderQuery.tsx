import React from 'react';
import Link from 'next/link';
import { fetchGraphQL } from './fetchGraphQL';
import { PostsQuery } from '@/queries/general/PostsQuery';
import { print } from 'graphql';
import { enrichBlocksWithMedia } from './blockMedia';
import { EnrichedBlock } from '@/types/coreBlockTypes';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from './blockStyles';

// Local type to avoid dependency on generated graphql types
type Maybe<T> = T | null | undefined;
type Page = Record<string, any>;

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
  categories?: {
    nodes: Array<{
      id: string;
      name: string;
      uri: string;
    }>;
  };
  tags?: {
    nodes: Array<{
      id: string;
      name: string;
      uri: string;
    }>;
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

// Render blocks within post context
const renderPostBlocks = async (
  blocks: EnrichedBlock[],
  post: PostNode,
  page: Maybe<Page>,
  stylesCollector?: string[]
): Promise<React.ReactNode[]> => {
  const results: React.ReactNode[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const result = await renderSinglePostBlock(block, post, page, stylesCollector, i);
    if (result !== null) {
      results.push(result);
    }
  }

  return results;
};

// Render a single block with post context
const renderSinglePostBlock = async (
  block: EnrichedBlock,
  post: PostNode,
  page: Maybe<Page>,
  stylesCollector?: string[],
  index: number = 0
): Promise<React.ReactNode> => {
  const { attributes, innerBlocks } = block;
  const blockClasses = getBlockClasses(attributes || {}, getBlockBaseClass(block.name));
  const blockStyleAttr = getBlockStyleAttr(attributes?.style || {});

  // Handle post-title block
  if (block.name === 'core/post-title') {
    const level = attributes?.level || 2;
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    const isLink = attributes?.isLink;

    const titleContent = isLink ? (
      <Link href={post.uri}>{post.title}</Link>
    ) : (
      post.title
    );

    return (
      <Tag
        key={`post-title-${post.id}-${index}`}
        className={blockClasses}
        style={blockStyleAttr}
      >
        {titleContent}
      </Tag>
    );
  }

  // Handle post-date block
  if (block.name === 'core/post-date') {
    const dateObj = new Date(post.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <time
        key={`post-date-${post.id}-${index}`}
        className={blockClasses}
        dateTime={post.date}
        style={blockStyleAttr}
      >
        {formattedDate}
      </time>
    );
  }

  // Handle post-excerpt block
  if (block.name === 'core/post-excerpt') {
    const moreText = attributes?.moreText;
    const excerptLength = attributes?.excerptLength || 55;

    // Strip HTML tags and truncate
    const rawExcerpt = post.excerpt?.replace(/<[^>]*>/g, '') || '';
    const words = rawExcerpt.split(/\s+/);
    const truncatedExcerpt = words.length > excerptLength
      ? words.slice(0, excerptLength).join(' ') + '...'
      : rawExcerpt;

    return (
      <div key={`post-excerpt-${post.id}-${index}`} className={blockClasses} style={blockStyleAttr}>
        <p>{truncatedExcerpt}</p>
        {moreText && (
          <p className="wp-block-post-excerpt__more-text">
            <Link href={post.uri}>{moreText}</Link>
          </p>
        )}
      </div>
    );
  }

  // Handle post-terms block (categories/tags)
  if (block.name === 'core/post-terms') {
    const term = attributes?.term || 'category';
    const separator = attributes?.separator || ', ';
    const terms = term === 'category' ? post.categories?.nodes : post.tags?.nodes;

    if (!terms || terms.length === 0) {
      return null;
    }

    return (
      <div key={`post-terms-${post.id}-${index}`} className={blockClasses} style={blockStyleAttr}>
        {terms.map((t, i) => (
          <React.Fragment key={t.id}>
            <Link href={t.uri} rel="tag">{t.name}</Link>
            {i < terms.length - 1 && separator}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // Handle post-featured-image block
  if (block.name === 'core/post-featured-image') {
    const featuredImage = post.featuredImage?.node;
    if (!featuredImage) {
      return null;
    }

    const isLink = attributes?.isLink;
    const width = attributes?.width;
    const height = attributes?.height;

    const imgElement = (
      <img
        src={featuredImage.sourceUrl}
        alt={featuredImage.altText || post.title}
        width={width || featuredImage.mediaDetails?.width}
        height={height || featuredImage.mediaDetails?.height}
        className="wp-block-post-featured-image__image"
        loading="lazy"
      />
    );

    return (
      <figure key={`post-featured-image-${post.id}-${index}`} className={blockClasses} style={blockStyleAttr}>
        {isLink ? <Link href={post.uri}>{imgElement}</Link> : imgElement}
      </figure>
    );
  }

  // Handle group and other container blocks with inner blocks
  if (block.name === 'core/group' && innerBlocks && innerBlocks.length > 0) {
    const enrichedInnerBlocks = await enrichBlocksWithMedia(innerBlocks as EnrichedBlock[]);
    const renderedInnerBlocks = await renderPostBlocks(enrichedInnerBlocks, post, page, stylesCollector);
    const tagName = attributes?.tagName || 'div';
    const Tag = tagName as keyof JSX.IntrinsicElements;

    return (
      <Tag
        key={`group-${post.id}-${index}`}
        className={blockClasses}
        style={blockStyleAttr}
      >
        {renderedInnerBlocks}
      </Tag>
    );
  }

  // For other blocks, try to render with saveContent
  if (block.saveContent) {
    return (
      <div
        key={`block-${post.id}-${index}`}
        dangerouslySetInnerHTML={{ __html: block.saveContent }}
      />
    );
  }

  return null;
};

const renderQuery = async (
  block: EnrichedBlock,
  page: Maybe<Page>,
  stylesCollector?: string[],
  index: number = 0
): Promise<React.ReactNode> => {
  const { attributes, innerBlocks } = block;
  const query = attributes?.query || {};
  const perPage = query.perPage || 10;

  const blockClasses = getBlockClasses(attributes || {}, 'wp-block-query');
  const blockStyleAttr = getBlockStyleAttr(attributes?.style || {});

  // Fetch posts from WordPress
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

  // Find the post-template, pagination, and no-results blocks
  const postTemplateBlock = innerBlocks?.find(
    (b: EnrichedBlock) => b.name === 'core/post-template'
  );
  const paginationBlock = innerBlocks?.find(
    (b: EnrichedBlock) => b.name === 'core/query-pagination'
  );
  const noResultsBlock = innerBlocks?.find(
    (b: EnrichedBlock) => b.name === 'core/query-no-results'
  );

  // Render post template for each post
  let renderedPosts: React.ReactNode[] = [];
  if (posts.length > 0 && postTemplateBlock?.innerBlocks) {
    const enrichedTemplateBlocks = await enrichBlocksWithMedia(
      postTemplateBlock.innerBlocks as EnrichedBlock[]
    );

    renderedPosts = await Promise.all(
      posts.map(async (post, postIndex) => {
        const postContent = await renderPostBlocks(
          enrichedTemplateBlocks,
          post,
          page,
          stylesCollector
        );
        return (
          <li key={post.id} className="wp-block-post">
            {postContent}
          </li>
        );
      })
    );
  }

  // Render no results message if no posts
  let noResultsContent: React.ReactNode = null;
  if (posts.length === 0 && noResultsBlock) {
    const noResultsClasses = getBlockClasses(noResultsBlock.attributes || {}, 'wp-block-query-no-results');
    noResultsContent = (
      <div className={noResultsClasses}>
        {noResultsBlock.innerBlocks?.map((innerBlock: EnrichedBlock, i: number) => {
          if (innerBlock.saveContent) {
            return (
              <div key={i} dangerouslySetInnerHTML={{ __html: innerBlock.saveContent }} />
            );
          }
          return null;
        })}
      </div>
    );
  }

  // Render pagination (basic static rendering for now)
  let paginationContent: React.ReactNode = null;
  if (paginationBlock && (pageInfo?.hasNextPage || pageInfo?.hasPreviousPage)) {
    const paginationClasses = getBlockClasses(paginationBlock.attributes || {}, 'wp-block-query-pagination');
    paginationContent = (
      <nav aria-label="Pagination" className={paginationClasses}>
        {/* Static pagination - full implementation would need route handling */}
      </nav>
    );
  }

  const postTemplateClasses = postTemplateBlock?.attributes?.className || '';

  return (
    <div
      key={index}
      className={blockClasses}
      style={blockStyleAttr}
    >
      {posts.length > 0 && (
        <ul className={`wp-block-post-template ${postTemplateClasses}`.trim()}>
          {renderedPosts}
        </ul>
      )}
      {noResultsContent}
      {paginationContent}
    </div>
  );
};

export default renderQuery;
