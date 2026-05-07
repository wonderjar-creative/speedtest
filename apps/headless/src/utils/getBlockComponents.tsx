import React from 'react';
import dynamic from 'next/dynamic';
import {
  Maybe,
  CoreButtonBlockAttributes,
  CoreButtonsBlockAttributes,
  CoreColumnBlockAttributes,
  CoreGroupBlockAttributes,
  CoreImageBlockAttributes,
  CoreCoverBlockAttributes,
  CoreHeadingBlockAttributes,
  CoreNavigationBlockAttributes,
  CoreNavigationLinkBlockAttributes,
  CoreParagraphBlockAttributes,
  CorePostTitleBlockAttributes,
  CoreSiteTitleBlockAttributes,
  CoreSiteLogoBlockAttributes,
  CoreColumnsBlockAttributes,
  CoreSeparatorBlockAttributes,
  NodeWithFeaturedImageToMediaItemConnectionEdge,
  CoreDetailsBlockAttributes
} from '@/gql/graphql';
import { ContentNodeWithBlocks } from '@/types/coreBlockTypes';

// Re-export for convenience
export type { ContentNodeWithBlocks } from '@/types/coreBlockTypes';
import renderTemplatePart from './renderTemplatePart';
import renderPattern from './renderPattern';
import renderPostContent from './renderPostContent';
import renderQuery from './renderQuery';
import { enrichBlocksWithMedia } from '@/utils/blockMedia';
import { EnrichedBlock } from '@/types/coreBlockTypes';
import { styleElementsToCSS } from '@/utils/blockStyles';

const generateRandomId = (length = 8) => {
  return Math.random().toString(36).substring(2, 2 + length);
}

const getBlockComponents = async (
  enrichedBlocks: EnrichedBlock[],
  page: ContentNodeWithBlocks,
  stylesCollector?: string[],
): Promise<React.ReactNode[]> => {
  if (!enrichedBlocks || enrichedBlocks.length === 0) {
    console.log('No blocks to render.');
    return [];
  }

  const featuredImage: Maybe<NodeWithFeaturedImageToMediaItemConnectionEdge> = page?.featuredImage || null;

  return Promise.all(enrichedBlocks.map(async (block: EnrichedBlock, index: number) => {

    // Handle template parts - resolve to actual blocks
    if (block.name === 'core/template-part' && block.attributes?.slug) {
      return await renderTemplatePart(block.attributes.slug, page, stylesCollector, index);
    }

    // Handle patterns - resolve to actual blocks
    if (block.name === 'core/pattern' && block.attributes?.slug) {
      return await renderPattern(block.attributes.slug, page, stylesCollector, index);
    }

    // Handle Query blocks - fetch posts and render with context
    if (block.name === 'core/query') {
      return await renderQuery(block, page, stylesCollector, index);
    }

    let innerBlocks: Maybe<React.ReactNode[]> = [];

    // Handle nested blocks recursively
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      innerBlocks = await getBlockComponents(
        await enrichBlocksWithMedia(block.innerBlocks as EnrichedBlock[]),
        page,
        stylesCollector
      );
    }

    // Collect block styles if provided (for style.elements or custom layout.contentSize)
    const blockAttributes = block.attributes;
    const hasCustomStyles = blockAttributes?.style?.elements;
    const hasCustomContentSize = blockAttributes?.layout?.contentSize;

    const blockId = stylesCollector && (hasCustomStyles || hasCustomContentSize)
      ? (() => {
        const id = generateRandomId();
        const css = styleElementsToCSS(id, blockAttributes.style || {}, blockAttributes.layout);
        stylesCollector.push(css);
        blockAttributes.className = blockAttributes.className ? `${blockAttributes.className} wp-block-${id}` : `wp-block-${id}`;
        return id;
      })()
      : null;

    switch (block.name) {
      case 'core/html': {
        return block.saveContent ? (
          <div key={index} dangerouslySetInnerHTML={{ __html: block.saveContent }} />
        ) : null;
      }
      case 'core/button': {
        const Button = dynamic(() => import('@/components/Blocks/Core/Button/Button'), { ssr: true });

        return (
          <Button
            key={index}
            name={block.name}
            attributes={block.attributes as CoreButtonBlockAttributes}
            saveContent={block.saveContent}
          />
        );
      }
      case 'core/buttons': {
        const Buttons = dynamic(() => import('@/components/Blocks/Core/Buttons/Buttons'), { ssr: true });

        return (
          <Buttons
            key={index}
            name={block.name}
            attributes={block.attributes as CoreButtonsBlockAttributes}
            innerBlocks={innerBlocks}
          />
        );
      }
      case 'core/column': {
        const Column = dynamic(() => import('@/components/Blocks/Core/Column/Column'), { ssr: true });

        return (
          <Column
            key={index}
            name={block.name}
            attributes={block.attributes as CoreColumnBlockAttributes}
            innerBlocks={innerBlocks}
          />
        );
      }
      case 'core/columns': {
        const Columns = dynamic(() => import('@/components/Blocks/Core/Columns/Columns'), { ssr: true });

        return (
          <Columns
            key={index}
            name={block.name}
            attributes={block.attributes as CoreColumnsBlockAttributes}
            innerBlocks={innerBlocks}
          />
        );
      }
      case 'core/cover': {
        const Cover = dynamic(() => import('@/components/Blocks/Core/Cover/Cover'), { ssr: true });

        return (
          <Cover
            key={index}
            name={block.name}
            attributes={block.attributes as CoreCoverBlockAttributes}
            featuredImage={featuredImage}
            mediaItem={block.mediaItem}
            innerBlocks={innerBlocks}
          />
        );
      }
      case 'core/details': {
        const Details = dynamic(() => import('@/components/Blocks/Core/Details/Details'), { ssr: true });

        return (
          <Details
            key={index}
            name={block.name}
            attributes={block.attributes as CoreDetailsBlockAttributes}
            innerBlocks={innerBlocks}
            saveContent={block.saveContent}
          />
        );
      }
      case 'core/group': {
        const Group = dynamic(() => import('@/components/Blocks/Core/Group/Group'), { ssr: true });

        return (
          <Group
            key={index}
            name={block.name}
            attributes={block.attributes as CoreGroupBlockAttributes}
            mediaItem={block.mediaItem}
            innerBlocks={innerBlocks}
          />
        );
      }
      case 'core/heading': {
        const Heading = dynamic(() => import('@/components/Blocks/Core/Heading/Heading'), { ssr: true });

        return (
          <Heading
            key={index}
            name={block.name}
            attributes={block.attributes as CoreHeadingBlockAttributes}
            saveContent={block.saveContent}
          />
        );
      }
      case 'core/list': {
        const List = dynamic(() => import('@/components/Blocks/Core/List/List'), { ssr: true });

        return (
          <List
            key={index}
            name={block.name}
            attributes={block.attributes}
            innerBlocks={innerBlocks}
            saveContent={block.saveContent || block.dynamicContent}
          />
        );
      }
      case 'core/list-item': {
        const ListItem = dynamic(() => import('@/components/Blocks/Core/ListItem/ListItem'), { ssr: true });

        return (
          <ListItem
            key={index}
            name={block.name}
            attributes={block.attributes}
            saveContent={block.saveContent}
            dynamicContent={block.dynamicContent}
            innerBlocks={innerBlocks}
          />
        );
      }
      case 'core/image': {
        const Image = dynamic(() => import('@/components/Blocks/Core/Image/Image'), { ssr: true });

        return (
          <Image
            key={index}
            name={block.name}
            attributes={block.attributes as CoreImageBlockAttributes}
            mediaItem={block.mediaItem}
            saveContent={block.saveContent}
            dynamicContent={block.dynamicContent}
          />
        );
      }
      case 'core/navigation': {
        const Navigation = dynamic(() => import('@/components/Blocks/Core/Navigation/Navigation'), { ssr: true });

        return (
          <Navigation
            key={index}
            name={block.name}
            attributes={block.attributes as CoreNavigationBlockAttributes}
            saveContent={block.saveContent}
            rawInnerBlocks={block.innerBlocks as EnrichedBlock[]}
          />
        );
      }
      case 'core/navigation-link': {
        const NavigationLink = dynamic(() => import('@/components/Blocks/Core/NavigationLink/NavigationLink'), { ssr: true });

        return (
          <NavigationLink
            key={index}
            name={block.name}
            attributes={block.attributes as CoreNavigationLinkBlockAttributes}
            saveContent={block.saveContent}
          />
        );
      }
      case 'core/paragraph': {
        const Paragraph = dynamic(() => import('@/components/Blocks/Core/Paragraph/Paragraph'), { ssr: true });

        return (
          <Paragraph
            key={index}
            name={block.name}
            attributes={block.attributes as CoreParagraphBlockAttributes}
            saveContent={block.saveContent}
          />
        );
      }
      case 'core/separator': {
        const Separator = dynamic(() => import('@/components/Blocks/Core/Separator/Separator'), { ssr: true });

        return (
          <Separator
            key={index}
            name={block.name}
            attributes={block.attributes as CoreSeparatorBlockAttributes}
          />
        );
      }
      case 'core/post-content': {
        return await renderPostContent(block.name, block.attributes, page, stylesCollector, index);
      }
      case 'core/post-featured-image': {
        const PostFeaturedImage = dynamic(() => import('@/components/Blocks/Core/PostFeaturedImage/PostFeaturedImage'), { ssr: true });

        return (
          <PostFeaturedImage
            key={index}
            name={block.name}
            attributes={block.attributes}
            featuredImage={featuredImage}
            postUri={page?.uri ?? undefined}
            postTitle={page?.title ?? undefined}
          />
        );
      }
      case 'core/post-title': {
        const PostTitle = dynamic(() => import('@/components/Blocks/Core/PostTitle/PostTitle'), { ssr: true });

        return (
          <PostTitle
            key={index}
            name={block.name}
            attributes={block.attributes as CorePostTitleBlockAttributes}
            isDynamic={block.isDynamic}
            dynamicContent={block.dynamicContent}
            saveContent={block.saveContent}
            page={page}
          />
        );
      }
      case 'core/post-terms': {
        const PostTerms = dynamic(() => import('@/components/Blocks/Core/PostTerms/PostTerms'), { ssr: true });

        return (
          <PostTerms
            key={index}
            name={block.name}
            attributes={block.attributes as any}
            page={page}
          />
        );
      }
      case 'core/site-title': {
        const SiteTitle = dynamic(() => import('@/components/Blocks/Core/SiteTitle/SiteTitle'), { ssr: true });

        return (
          <SiteTitle
            key={index}
            name={block.name}
            attributes={block.attributes as CoreSiteTitleBlockAttributes}
            isDynamic={block.isDynamic}
            dynamicContent={block.dynamicContent}
            saveContent={block.saveContent}
          />
        );
      }
      case 'core/site-logo': {
        const SiteLogo = dynamic(() => import('@/components/Blocks/Core/SiteLogo/SiteLogo'), { ssr: true });

        return (
          <SiteLogo
            key={index}
            name={block.name}
            attributes={block.attributes as CoreSiteLogoBlockAttributes}
            isDynamic={block.isDynamic}
            dynamicContent={block.dynamicContent}
            saveContent={block.saveContent}
            mediaItem={block.mediaItem}
          />
        );
      }
      default: {
        const Default = dynamic(() => import('@/components/Blocks/Core/Default'), { ssr: true });
        const { attributes } = block as any;

        return (
          <Default
            key={index}
            name={block.name}
            attributes={attributes}
            dynamicContent={block.dynamicContent}
            saveContent={block.saveContent}
            innerBlocks={innerBlocks}
          />
        );
      }
    }
  }));
};

export default getBlockComponents;
