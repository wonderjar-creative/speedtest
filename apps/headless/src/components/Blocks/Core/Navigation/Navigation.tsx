import { FrontendBlock, EnrichedBlock } from "@/types/coreBlockTypes";
import { CoreNavigationBlockAttributes } from "@/gql/graphql";
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from "@/utils/blockStyles";
import NavigationMenu from "./NavigationMenu";

export interface CoreNavigationBlock extends FrontendBlock {
  attributes?: CoreNavigationBlockAttributes;
  rawInnerBlocks?: EnrichedBlock[];
}

interface NavigationData {
  id: number;
  title: string;
  blocks: any[];
}

interface NavigationLink {
  id?: string;
  label: string;
  url: string;
  path?: string;
  target?: string;
  cssClasses?: string[];
  children?: NavigationLink[];
}

const processNavigationBlocks = (blocks: any[]): NavigationLink[] => {
  return blocks
    .filter((block) =>
      block.name === 'core/navigation-link' ||
      block.name === 'core/navigation-submenu'
    )
    .map((block) => {
      const link: NavigationLink = {
        id: block.attributes?.id?.toString(),
        label: block.attributes?.label || 'Link',
        url: block.attributes?.url || '/',
        path: block.attributes?.url || '/',
        target: block.attributes?.target,
        cssClasses: block.attributes?.className ? [block.attributes.className] : []
      };

      if (block.innerBlocks && block.innerBlocks.length > 0) {
        link.children = processNavigationBlocks(block.innerBlocks);
      }

      return link;
    });
};

const fetchNavigationData = async (ref: number | undefined): Promise<NavigationData | null> => {
  if (!ref) return null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/wp-json/blocks/v1/navigation/${ref}`, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      console.error('Navigation fetch failed:', response.status, response.statusText);
      return null;
    }

    const data: NavigationData = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return null;
  }
};

const Navigation: React.FC<CoreNavigationBlock> = async ({ name, attributes, rawInnerBlocks }) => {
  const { ref, layout } = attributes || {};
  const navClasses = getBlockClasses(attributes ?? {}, getBlockBaseClass(name));
  const navStyleAttr = getBlockStyleAttr(attributes?.style);

  // Try fetching from saved wp_navigation post first
  const navData = await fetchNavigationData(ref as number | undefined);
  let navigationLinks: NavigationLink[] = [];

  if (navData?.blocks && navData.blocks.length > 0) {
    // Saved navigation post (ref exists)
    navigationLinks = processNavigationBlocks(navData.blocks);
  } else if (rawInnerBlocks && rawInnerBlocks.length > 0) {
    // Inline navigation from pattern/template (no ref)
    navigationLinks = processNavigationBlocks(rawInnerBlocks);
  }

  if (navigationLinks.length === 0) {
    const listAttributes = { layout: { type: 'flex', flexWrap: 'nowrap' } };
    const listClasses = getBlockClasses(listAttributes, 'wp-block-navigation__list');

    return (
      <nav className={navClasses} style={navStyleAttr}>
        <ul className={listClasses}>
          <li>
            <a href="/">Home (fallback)</a>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <NavigationMenu
      links={navigationLinks}
      title={navData?.title || 'Navigation'}
      className={navClasses}
      style={navStyleAttr}
    />
  );
};

export default Navigation;
