/**
 * Block types for the headless frontend.
 *
 * Simplified from wonderjar-frontend's coreBlockTypes.ts.
 * No GraphQL codegen dependency — types defined inline.
 */

import type React from "react";

export interface MediaItem {
  node?: {
    sourceUrl?: string;
    altText?: string;
    mediaDetails?: {
      width?: number;
      height?: number;
      sizes?: Record<
        string,
        {
          sourceUrl: string;
          width: number;
          height: number;
        }
      >;
    };
  };
}

export interface EnrichedBlock {
  name: string;
  attributes?: Record<string, any>;
  mediaItem?: MediaItem;
  innerBlocks?: EnrichedBlock[];
  saveContent?: string;
  dynamicContent?: string;
  isDynamic?: boolean;
  innerContent?: string[];
}

export interface FrontendBlock {
  name: string;
  attributes?: Record<string, any>;
  dynamicContent?: string | null;
  saveContent?: string | null;
  isDynamic?: boolean;
  innerBlocks?: React.ReactNode;
  mediaItem?: MediaItem;
  [key: string]: any;
}

/**
 * Content node from GraphQL — works for both Page and Post.
 */
export interface ContentNode {
  databaseId: number;
  title?: string;
  slug?: string;
  uri?: string;
  status?: string;
  contentTypeName?: string;
  isPostsPage?: boolean;
  isFrontPage?: boolean;
  blocksData?: string;
  content?: string;
  templateSlug?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  } | null;
  // Post-specific fields
  date?: string;
  categories?: {
    nodes: Array<{ id: string; name: string; slug: string; uri?: string }>;
  };
  tags?: {
    nodes: Array<{ id: string; name: string; slug: string; uri?: string }>;
  };
}

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
    nodes: Array<{ id: string; name: string; uri: string }>;
  };
  tags?: {
    nodes: Array<{ id: string; name: string; uri: string }>;
  };
}
