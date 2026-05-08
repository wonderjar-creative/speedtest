import React, { type JSX } from 'react';
import Link from 'next/link';
import { fetchGraphQL } from './fetchGraphQL';
import { PostsQuery } from '@/queries/general/PostsQuery';
import { TeamMembersQuery } from '@/queries/general/TeamMembersQuery';
import { ProjectsQuery } from '@/queries/general/ProjectsQuery';
import { TestimonialsQuery } from '@/queries/general/TestimonialsQuery';
import { print } from 'graphql';
import { enrichBlocksWithMedia } from './blockMedia';
import { EnrichedBlock } from '@/types/coreBlockTypes';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from './blockStyles';
import { fetchPatternWithISR } from './isrFetchers';
import getPattern from './getPattern';

// Local type to avoid dependency on generated graphql types
type Maybe<T> = T | null | undefined;
type Page = Record<string, any>;

export interface PostNode {
  id: string;
  databaseId: number;
  title: string;
  excerpt?: string;
  date?: string;
  uri: string;
  content?: string;
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
  // CPT meta fields (team_member)
  position?: string;
  bio?: string;
  order?: number;
  // CPT meta fields (project)
  location?: string;
  projectType?: string;
  squareFootage?: number;
  yearCompleted?: number;
  // CPT meta fields (testimonial)
  authorName?: string;
  authorRole?: string;
  rating?: number;
  // Shared
  photoUrl?: string;
}

interface QueryResultCollection {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };
  nodes: PostNode[];
}

// Meta key (snake_case) to PostNode property (camelCase) mapping
const META_KEY_MAP: Record<string, keyof PostNode> = {
  position: 'position',
  bio: 'bio',
  photo_url: 'photoUrl',
  order: 'order',
  location: 'location',
  project_type: 'projectType',
  square_footage: 'squareFootage',
  year_completed: 'yearCompleted',
  author_name: 'authorName',
  author_role: 'authorRole',
  rating: 'rating',
};

/**
 * Map a postType to the correct GraphQL query and result field name.
 */
const getQueryConfig = (postType: string) => {
  switch (postType) {
    case 'team_member':
      return { query: TeamMembersQuery, field: 'teamMembers' };
    case 'project':
      return { query: ProjectsQuery, field: 'projects' };
    case 'testimonial':
      return { query: TestimonialsQuery, field: 'testimonials' };
    default:
      return { query: PostsQuery, field: 'posts' };
  }
};

/**
 * Resolve block bindings from elevation/post-meta source.
 * Mutates the block's saveContent or attributes based on bound meta values.
 */
const resolveBlockBindings = (block: EnrichedBlock, post: PostNode): EnrichedBlock => {
  const bindings = block.attributes?.metadata?.bindings;
  if (!bindings) return block;

  const resolved = { ...block, attributes: { ...block.attributes } };

  // Resolve content binding
  if (bindings.content?.source === 'elevation/post-meta') {
    const metaKey = bindings.content.args?.key;
    if (metaKey) {
      const propName = META_KEY_MAP[metaKey] || metaKey;
      let value = (post as Record<string, any>)[propName];

      // Convert rating to stars
      if (metaKey === 'rating' && typeof value === 'number') {
        value = '★'.repeat(Math.min(5, Math.max(0, value)));
      }

      if (value !== undefined && value !== null) {
        // Replace saveContent with the resolved value
        resolved.saveContent = `<p>${String(value)}</p>`;
      }
    }
  }

  // Resolve url binding
  if (bindings.url?.source === 'elevation/post-meta') {
    const metaKey = bindings.url.args?.key;
    if (metaKey) {
      const propName = META_KEY_MAP[metaKey] || metaKey;
      const value = (post as Record<string, any>)[propName];
      if (value) {
        resolved.attributes = { ...resolved.attributes, url: String(value) };
      }
    }
  }

  return resolved;
};

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
  originalBlock: EnrichedBlock,
  post: PostNode,
  page: Maybe<Page>,
  stylesCollector?: string[],
  index: number = 0
): Promise<React.ReactNode> => {
  // Resolve any block bindings before rendering
  const block = resolveBlockBindings(originalBlock, post);
  const { attributes, innerBlocks } = block;
  const blockClasses = getBlockClasses(attributes || {}, getBlockBaseClass(block.name));
  const blockStyleAttr = getBlockStyleAttr(attributes?.style || {});

  // Handle pattern blocks — resolve and render with post context
  if (block.name === 'core/pattern' && attributes?.slug) {
    try {
      const cleanSlug = attributes.slug.replace(/^[^/]+\//, '');
      let pattern = await fetchPatternWithISR(cleanSlug);
      if (!pattern || !pattern.blocksJSON) {
        pattern = getPattern(cleanSlug);
      }
      if (pattern && pattern.blocksJSON) {
        const patternBlocks = JSON.parse(pattern.blocksJSON);
        const enriched = await enrichBlocksWithMedia(patternBlocks);
        const rendered = await renderPostBlocks(enriched, post, page, stylesCollector);
        return <React.Fragment key={`pattern-${post.id}-${index}`}>{rendered}</React.Fragment>;
      }
    } catch (error) {
      console.error(`Error rendering pattern in post context: ${attributes.slug}`, error);
    }
    return null;
  }

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
    if (!post.date) return null;
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
    const aspectRatio = attributes?.aspectRatio;
    const scale = attributes?.scale;

    const imgStyle: React.CSSProperties = {};
    if (aspectRatio) imgStyle.aspectRatio = aspectRatio;
    if (scale) imgStyle.objectFit = scale as React.CSSProperties['objectFit'];
    if (aspectRatio || scale) {
      imgStyle.width = '100%';
      imgStyle.height = '100%';
    }

    const figureStyle: React.CSSProperties = {
      ...blockStyleAttr,
      ...(aspectRatio ? { aspectRatio } : {}),
    };

    const imgElement = (
      <img
        src={featuredImage.sourceUrl}
        alt={featuredImage.altText || post.title}
        width={width || featuredImage.mediaDetails?.width}
        height={height || featuredImage.mediaDetails?.height}
        className="wp-block-post-featured-image__image"
        style={Object.keys(imgStyle).length > 0 ? imgStyle : undefined}
        loading="lazy"
      />
    );

    return (
      <figure key={`post-featured-image-${post.id}-${index}`} className={blockClasses} style={figureStyle}>
        {isLink ? <Link href={post.uri}>{imgElement}</Link> : imgElement}
      </figure>
    );
  }

  // Handle post-content block (used in testimonial cards)
  if (block.name === 'core/post-content') {
    const postContent = post.content || '';
    if (!postContent) return null;
    return (
      <div
        key={`post-content-${post.id}-${index}`}
        className={blockClasses}
        style={blockStyleAttr}
        dangerouslySetInnerHTML={{ __html: postContent }}
      />
    );
  }

  // Handle paragraph block with resolved bindings
  if (block.name === 'core/paragraph' && block.saveContent) {
    // saveContent is already wrapped in <p>, extract inner HTML
    const inner = block.saveContent.replace(/^<p[^>]*>/, '').replace(/<\/p>$/, '');
    return (
      <p
        key={`paragraph-${post.id}-${index}`}
        dangerouslySetInnerHTML={{ __html: inner }}
        className={blockClasses}
        style={blockStyleAttr}
      />
    );
  }

  // Handle column blocks - recursively render inner blocks
  if (block.name === 'core/column' && innerBlocks && innerBlocks.length > 0) {
    const enrichedInnerBlocks = await enrichBlocksWithMedia(innerBlocks as EnrichedBlock[]);
    const renderedInnerBlocks = await renderPostBlocks(enrichedInnerBlocks, post, page, stylesCollector);
    return (
      <div
        key={`column-${post.id}-${index}`}
        className={blockClasses}
        style={blockStyleAttr}
      >
        {renderedInnerBlocks}
      </div>
    );
  }

  // Handle columns blocks - recursively render inner blocks
  if (block.name === 'core/columns' && innerBlocks && innerBlocks.length > 0) {
    const enrichedInnerBlocks = await enrichBlocksWithMedia(innerBlocks as EnrichedBlock[]);
    const renderedInnerBlocks = await renderPostBlocks(enrichedInnerBlocks, post, page, stylesCollector);
    return (
      <div
        key={`columns-${post.id}-${index}`}
        className={blockClasses}
        style={blockStyleAttr}
      >
        {renderedInnerBlocks}
      </div>
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
  const postType = query.postType || 'post';

  const blockClasses = getBlockClasses(attributes || {}, 'wp-block-query');
  const blockStyleAttr = getBlockStyleAttr(attributes?.style || {});

  // Determine which GraphQL query to use based on postType
  const queryConfig = getQueryConfig(postType);

  // Fetch posts from WordPress
  let posts: PostNode[] = [];
  let pageInfo = null;

  try {
    const result = await fetchGraphQL<Record<string, QueryResultCollection>>(
      print(queryConfig.query),
      { first: perPage }
    );
    const collection = result[queryConfig.field];
    posts = collection?.nodes || [];
    pageInfo = collection?.pageInfo || null;
  } catch (error) {
    console.error(`Error fetching ${postType} for Query block:`, error);
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

  // Build grid styles from post-template layout
  const templateLayout = postTemplateBlock?.attributes?.layout;
  const templateStyle = postTemplateBlock?.attributes?.style;
  const templateStyleObj: Record<string, string> = {};
  const isGridLayout = templateLayout?.type === 'grid' && !!templateLayout?.columnCount;
  if (isGridLayout) {
    templateStyleObj.gridTemplateColumns = `repeat(${templateLayout!.columnCount}, 1fr)`;
  }
  if (templateStyle?.spacing?.blockGap) {
    const gap = templateStyle.spacing.blockGap;
    // Handle var:preset|spacing|X format
    const gapValue = typeof gap === 'string' && gap.startsWith('var:')
      ? `var(--wp--${gap.slice(4).replace(/\|/g, '--')})`
      : gap;
    templateStyleObj.gap = gapValue;
  }

  return (
    <div
      key={index}
      className={blockClasses}
      style={blockStyleAttr}
    >
      {posts.length > 0 && (
        <ul
          className={['wp-block-post-template', isGridLayout && 'is-layout-grid', postTemplateClasses].filter(Boolean).join(' ')}
          style={Object.keys(templateStyleObj).length > 0 ? templateStyleObj : undefined}
        >
          {renderedPosts}
        </ul>
      )}
      {noResultsContent}
      {paginationContent}
    </div>
  );
};

export default renderQuery;
