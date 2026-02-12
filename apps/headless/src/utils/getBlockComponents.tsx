/**
 * Master block router.
 *
 * Takes an array of enriched blocks and returns React components.
 * Maps WordPress block types to their React component equivalents.
 * Handles template parts, patterns, and query blocks via recursive
 * resolution.
 *
 * Ported from wonderjar-frontend getBlockComponents.tsx, simplified
 * to use direct imports instead of dynamic() for cleaner SSR.
 */

import React from "react";
import renderTemplatePart from "./renderTemplatePart";
import renderPattern from "./renderPattern";
import renderPostContent from "./renderPostContent";
import renderQuery from "./renderQuery";
import { enrichBlocksWithMedia } from "./blockMedia";
import { styleElementsToCSS } from "./blockStyles";
import type { EnrichedBlock, ContentNode } from "@/types/blocks";

// Block components
import Button from "@/components/Blocks/Button";
import Buttons from "@/components/Blocks/Buttons";
import Column from "@/components/Blocks/Column";
import Columns from "@/components/Blocks/Columns";
import Cover from "@/components/Blocks/Cover";
import Group from "@/components/Blocks/Group";
import Heading from "@/components/Blocks/Heading";
import BlockImage from "@/components/Blocks/BlockImage";
import List from "@/components/Blocks/List";
import ListItem from "@/components/Blocks/ListItem";
import Navigation from "@/components/Blocks/Navigation";
import NavigationLink from "@/components/Blocks/NavigationLink";
import Paragraph from "@/components/Blocks/Paragraph";
import PostTitle from "@/components/Blocks/PostTitle";
import Separator from "@/components/Blocks/Separator";
import SiteLogo from "@/components/Blocks/SiteLogo";
import SiteTitle from "@/components/Blocks/SiteTitle";
import Default from "@/components/Blocks/Default";

const generateRandomId = (length = 8) => {
  return Math.random().toString(36).substring(2, 2 + length);
};

const getBlockComponents = async (
  enrichedBlocks: EnrichedBlock[],
  page: ContentNode | null,
  stylesCollector?: string[]
): Promise<React.ReactNode[]> => {
  if (!enrichedBlocks || enrichedBlocks.length === 0) {
    return [];
  }

  const featuredImage = page?.featuredImage || null;

  return Promise.all(
    enrichedBlocks.map(async (block: EnrichedBlock, index: number) => {
      // Handle template parts — resolve to actual blocks
      if (block.name === "core/template-part" && block.attributes?.slug) {
        return await renderTemplatePart(
          block.attributes.slug,
          page,
          stylesCollector,
          index
        );
      }

      // Handle patterns — resolve to actual blocks
      if (block.name === "core/pattern" && block.attributes?.slug) {
        return await renderPattern(
          block.attributes.slug,
          page,
          stylesCollector,
          index
        );
      }

      // Handle Query blocks — fetch posts and render with context
      if (block.name === "core/query") {
        return await renderQuery(block, page, stylesCollector, index);
      }

      // Handle post-content — render the page's own blocks
      if (block.name === "core/post-content") {
        return await renderPostContent(
          block.name,
          block.attributes,
          page,
          stylesCollector,
          index
        );
      }

      // Recursively render inner blocks
      let innerBlocks: React.ReactNode[] = [];
      if (block.innerBlocks && block.innerBlocks.length > 0) {
        innerBlocks = await getBlockComponents(
          await enrichBlocksWithMedia(block.innerBlocks),
          page,
          stylesCollector
        );
      }

      // Collect block styles (for style.elements or custom layout.contentSize)
      const blockAttributes = block.attributes || {};
      const hasCustomStyles = blockAttributes?.style?.elements;
      const hasCustomContentSize = blockAttributes?.layout?.contentSize;

      if (
        stylesCollector &&
        (hasCustomStyles || hasCustomContentSize)
      ) {
        const id = generateRandomId();
        const css = styleElementsToCSS(
          id,
          blockAttributes.style || {},
          blockAttributes.layout
        );
        stylesCollector.push(css);
        blockAttributes.className = blockAttributes.className
          ? `${blockAttributes.className} wp-block-${id}`
          : `wp-block-${id}`;
      }

      // Map block types to components
      switch (block.name) {
        case "core/button":
          return (
            <Button
              key={index}
              name={block.name}
              attributes={blockAttributes}
              saveContent={block.saveContent}
            />
          );

        case "core/buttons":
          return (
            <Buttons
              key={index}
              name={block.name}
              attributes={blockAttributes}
              innerBlocks={innerBlocks}
            />
          );

        case "core/column":
          return (
            <Column
              key={index}
              name={block.name}
              attributes={blockAttributes}
              innerBlocks={innerBlocks}
            />
          );

        case "core/columns":
          return (
            <Columns
              key={index}
              name={block.name}
              attributes={blockAttributes}
              innerBlocks={innerBlocks}
            />
          );

        case "core/cover":
          return (
            <Cover
              key={index}
              name={block.name}
              attributes={blockAttributes}
              featuredImage={featuredImage}
              mediaItem={block.mediaItem}
              innerBlocks={innerBlocks}
            />
          );

        case "core/group":
          return (
            <Group
              key={index}
              name={block.name}
              attributes={blockAttributes}
              innerBlocks={innerBlocks}
            />
          );

        case "core/heading":
          return (
            <Heading
              key={index}
              name={block.name}
              attributes={blockAttributes}
              saveContent={block.saveContent}
            />
          );

        case "core/image":
          return (
            <BlockImage
              key={index}
              name={block.name}
              attributes={blockAttributes}
              mediaItem={block.mediaItem}
            />
          );

        case "core/list":
          return (
            <List
              key={index}
              name={block.name}
              attributes={blockAttributes}
              innerBlocks={innerBlocks}
            />
          );

        case "core/list-item":
          return (
            <ListItem
              key={index}
              name={block.name}
              attributes={blockAttributes}
              saveContent={block.saveContent}
              dynamicContent={block.dynamicContent}
              innerBlocks={innerBlocks}
            />
          );

        case "core/navigation":
          return (
            <Navigation
              key={index}
              name={block.name}
              attributes={blockAttributes}
              saveContent={block.saveContent}
            />
          );

        case "core/navigation-link":
          return (
            <NavigationLink
              key={index}
              name={block.name}
              attributes={blockAttributes}
              saveContent={block.saveContent}
            />
          );

        case "core/paragraph":
          return (
            <Paragraph
              key={index}
              name={block.name}
              attributes={blockAttributes}
              saveContent={block.saveContent}
            />
          );

        case "core/post-title":
          return (
            <PostTitle
              key={index}
              name={block.name}
              attributes={blockAttributes}
              isDynamic={block.isDynamic}
              dynamicContent={block.dynamicContent}
              saveContent={block.saveContent}
              page={page}
            />
          );

        case "core/separator":
          return (
            <Separator
              key={index}
              name={block.name}
              attributes={blockAttributes}
            />
          );

        case "core/site-title":
          return (
            <SiteTitle
              key={index}
              name={block.name}
              attributes={blockAttributes}
              isDynamic={block.isDynamic}
              dynamicContent={block.dynamicContent}
              saveContent={block.saveContent}
            />
          );

        case "core/site-logo":
          return (
            <SiteLogo
              key={index}
              name={block.name}
              attributes={blockAttributes}
              isDynamic={block.isDynamic}
              dynamicContent={block.dynamicContent}
              saveContent={block.saveContent}
              mediaItem={block.mediaItem}
            />
          );

        default:
          return (
            <Default
              key={index}
              name={block.name}
              attributes={blockAttributes}
              dynamicContent={block.dynamicContent}
              saveContent={block.saveContent}
              innerBlocks={innerBlocks}
            />
          );
      }
    })
  );
};

export default getBlockComponents;
