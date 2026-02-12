import Link from "next/link";
import type { FrontendBlock } from "@/types/blocks";
import {
  getBlockBaseClass,
  getBlockClasses,
  getBlockStyleAttr,
} from "@/utils/blockStyles";

interface NavigationLink {
  label: string;
  url: string;
  target?: string;
  children?: NavigationLink[];
}

const processNavigationBlocks = (blocks: any[]): NavigationLink[] => {
  return blocks
    .filter(
      (block) =>
        block.name === "core/navigation-link" ||
        block.name === "core/navigation-submenu"
    )
    .map((block) => {
      const link: NavigationLink = {
        label: block.attributes?.label || "Link",
        url: block.attributes?.url || "/",
        target: block.attributes?.target,
      };
      if (block.innerBlocks && block.innerBlocks.length > 0) {
        link.children = processNavigationBlocks(block.innerBlocks);
      }
      return link;
    });
};

const Navigation: React.FC<FrontendBlock> = async ({ name, attributes }) => {
  const { ref } = attributes || {};
  const navClasses = getBlockClasses(attributes ?? {}, getBlockBaseClass(name));
  const navStyleAttr = getBlockStyleAttr(attributes?.style);

  let links: NavigationLink[] = [];

  if (ref) {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "http://localhost:8080";
      const response = await fetch(
        `${baseUrl}/wp-json/blocks/v1/navigation/${ref}`,
        { next: { revalidate: 3600 } }
      );
      if (response.ok) {
        const data = await response.json();
        links = processNavigationBlocks(data.blocks || []);
      }
    } catch (error) {
      console.error("Error fetching navigation:", error);
    }
  }

  if (links.length === 0) {
    // Fallback navigation
    links = [
      { label: "Home", url: "/" },
      { label: "About", url: "/about" },
      { label: "Services", url: "/services" },
      { label: "Portfolio", url: "/portfolio" },
      { label: "Blog", url: "/blog" },
      { label: "Contact", url: "/contact" },
    ];
  }

  return (
    <nav className={navClasses} style={navStyleAttr}>
      <ul className="wp-block-navigation__list flex flex-wrap gap-4 list-none m-0 p-0">
        {links.map((link, i) => (
          <li key={i} className="wp-block-navigation-item">
            <Link href={link.url} target={link.target || undefined}>
              {link.label}
            </Link>
            {link.children && link.children.length > 0 && (
              <ul className="wp-block-navigation__submenu list-none m-0 p-0">
                {link.children.map((child, j) => (
                  <li key={j} className="wp-block-navigation-item">
                    <Link href={child.url}>{child.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
