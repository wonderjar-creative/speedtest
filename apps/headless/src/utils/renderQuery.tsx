/**
 * Renders the core/query block.
 *
 * Fetches posts via GraphQL and renders post-template blocks
 * for each post, with context-aware rendering for post-title,
 * post-date, post-excerpt, post-terms, post-featured-image.
 */

import React from "react";
import Link from "next/link";
import { fetchGraphQL } from "./fetchGraphQL";
import { enrichBlocksWithMedia } from "./blockMedia";
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from "./blockStyles";
import type { EnrichedBlock, PostNode, ContentNode } from "@/types/blocks";

const POSTS_QUERY = `
  query PostsForQuery($first: Int!) {
    posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        databaseId
        title
        excerpt
        date
        uri
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails { width height }
          }
        }
        categories {
          nodes { id name uri }
        }
        tags {
          nodes { id name uri }
        }
      }
    }
  }
`;

// Render blocks with post context
const renderPostBlocks = async (
  blocks: EnrichedBlock[],
  post: PostNode,
  _page: ContentNode | null,
  _stylesCollector?: string[]
): Promise<React.ReactNode[]> => {
  const results: React.ReactNode[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const result = await renderSinglePostBlock(blocks[i], post, i);
    if (result !== null) results.push(result);
  }

  return results;
};

const renderSinglePostBlock = async (
  block: EnrichedBlock,
  post: PostNode,
  index: number
): Promise<React.ReactNode> => {
  const { attributes, innerBlocks } = block;
  const blockClasses = getBlockClasses(
    attributes || {},
    getBlockBaseClass(block.name)
  );
  const blockStyleAttr = getBlockStyleAttr(attributes?.style || {});

  if (block.name === "core/post-title") {
    const level = attributes?.level || 2;
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    const isLink = attributes?.isLink;
    const titleContent = isLink ? (
      <Link href={post.uri}>{post.title}</Link>
    ) : (
      post.title
    );
    return (
      <Tag key={`post-title-${post.id}-${index}`} className={blockClasses} style={blockStyleAttr}>
        {titleContent}
      </Tag>
    );
  }

  if (block.name === "core/post-date") {
    const dateObj = new Date(post.date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return (
      <time key={`post-date-${post.id}-${index}`} className={blockClasses} dateTime={post.date} style={blockStyleAttr}>
        {formattedDate}
      </time>
    );
  }

  if (block.name === "core/post-excerpt") {
    const moreText = attributes?.moreText;
    const excerptLength = attributes?.excerptLength || 55;
    const rawExcerpt = post.excerpt?.replace(/<[^>]*>/g, "") || "";
    const words = rawExcerpt.split(/\s+/);
    const truncatedExcerpt =
      words.length > excerptLength
        ? words.slice(0, excerptLength).join(" ") + "..."
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

  if (block.name === "core/post-terms") {
    const term = attributes?.term || "category";
    const separator = attributes?.separator || ", ";
    const terms =
      term === "category" ? post.categories?.nodes : post.tags?.nodes;
    if (!terms || terms.length === 0) return null;
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

  if (block.name === "core/post-featured-image") {
    const featuredImage = post.featuredImage?.node;
    if (!featuredImage) return null;
    const isLink = attributes?.isLink;
    const imgElement = (
      <img
        src={featuredImage.sourceUrl}
        alt={featuredImage.altText || post.title}
        width={featuredImage.mediaDetails?.width}
        height={featuredImage.mediaDetails?.height}
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

  // Container blocks within post template
  if (block.name === "core/group" && innerBlocks && innerBlocks.length > 0) {
    const enrichedInnerBlocks = await enrichBlocksWithMedia(innerBlocks);
    const renderedInnerBlocks = await renderPostBlocks(
      enrichedInnerBlocks,
      post,
      null
    );
    const Tag = (attributes?.tagName || "div") as keyof JSX.IntrinsicElements;
    return (
      <Tag key={`group-${post.id}-${index}`} className={blockClasses} style={blockStyleAttr}>
        {renderedInnerBlocks}
      </Tag>
    );
  }

  // Fallback: render saveContent
  if (block.saveContent) {
    return (
      <div key={`block-${post.id}-${index}`} dangerouslySetInnerHTML={{ __html: block.saveContent }} />
    );
  }

  return null;
};

const renderQuery = async (
  block: EnrichedBlock,
  page: ContentNode | null,
  stylesCollector?: string[],
  index: number = 0
): Promise<React.ReactNode> => {
  const { attributes, innerBlocks } = block;
  const query = attributes?.query || {};
  const perPage = query.perPage || 10;
  const blockClasses = getBlockClasses(attributes || {}, "wp-block-query");
  const blockStyleAttr = getBlockStyleAttr(attributes?.style || {});

  let posts: PostNode[] = [];
  try {
    const result = await fetchGraphQL<{ posts: { nodes: PostNode[] } }>(
      POSTS_QUERY,
      { first: perPage }
    );
    posts = result.posts?.nodes || [];
  } catch (error) {
    console.error("Error fetching posts for Query block:", error);
  }

  const postTemplateBlock = innerBlocks?.find(
    (b: EnrichedBlock) => b.name === "core/post-template"
  );
  const noResultsBlock = innerBlocks?.find(
    (b: EnrichedBlock) => b.name === "core/query-no-results"
  );

  let renderedPosts: React.ReactNode[] = [];
  if (posts.length > 0 && postTemplateBlock?.innerBlocks) {
    const enrichedTemplateBlocks = await enrichBlocksWithMedia(
      postTemplateBlock.innerBlocks
    );
    renderedPosts = await Promise.all(
      posts.map(async (post) => {
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

  let noResultsContent: React.ReactNode = null;
  if (posts.length === 0 && noResultsBlock) {
    const noResultsClasses = getBlockClasses(
      noResultsBlock.attributes || {},
      "wp-block-query-no-results"
    );
    noResultsContent = (
      <div className={noResultsClasses}>
        {noResultsBlock.innerBlocks?.map((innerBlock: EnrichedBlock, i: number) =>
          innerBlock.saveContent ? (
            <div key={i} dangerouslySetInnerHTML={{ __html: innerBlock.saveContent }} />
          ) : null
        )}
      </div>
    );
  }

  const postTemplateClasses = postTemplateBlock?.attributes?.className || "";

  return (
    <div key={index} className={blockClasses} style={blockStyleAttr}>
      {posts.length > 0 && (
        <ul className={`wp-block-post-template ${postTemplateClasses}`.trim()}>
          {renderedPosts}
        </ul>
      )}
      {noResultsContent}
    </div>
  );
};

export default renderQuery;
