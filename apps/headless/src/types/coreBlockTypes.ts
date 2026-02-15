import {
  Maybe,
  Block,
  Page,
  Post,
} from '@/gql/graphql';
import React from 'react';

/**
 * Content node type that works for both Page and Post
 */
export type ContentNodeWithBlocks = Maybe<Page> | Maybe<Post>;

export interface MediaItem {
  node?: {
    sourceUrl?: string;
    altText?: string;
    mediaDetails?: {
      width?: number;
      height?: number;
      sizes?: Record<string, {
        sourceUrl: string;
        width: number;
        height: number;
      }>;
    }
  }
}

export interface EnrichedBlock extends Omit<Block, 'innerBlocks'> {
  name: string;
  attributes?: Record<string, any>;
  mediaItem?: MediaItem;
  innerBlocks?: EnrichedBlock[];
  saveContent?: string;
  dynamicContent?: string;
  isDynamic: boolean;
}

export type FrontendBlock = {
  name: string;
  attributes?: Record<string, any>;
  dynamicContent?: Maybe<string>;
  saveContent?: Maybe<string>;
  isDynamic?: boolean;
  innerBlocks?: React.ReactNode;
  mediaItem?: MediaItem;
  [key: string]: any; // For extra flexibility
}
