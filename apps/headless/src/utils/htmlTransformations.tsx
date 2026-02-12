/**
 * HTML transformation utilities.
 *
 * Converts WordPress HTML to React components, replacing internal
 * links with Next.js <Link> for client-side navigation.
 */

import Link from "next/link";
import parse, { domToReact, type DOMNode } from "html-react-parser";

export const stripOuterTag = (
  html: string,
  tagToStrip: string = "div"
): string => {
  return html.replace(
    new RegExp(`<${tagToStrip}[^>]*>(.*)<\\/${tagToStrip}>`, "s"),
    "$1"
  );
};

const HtmlReactParserReplace = (
  node: DOMNode
): string | boolean | void | object | Element | null => {
  if (node.type === "tag" && node.name === "a") {
    const { class: className, href, target, rel } = node.attribs;
    // Convert internal links to Next.js Link
    if (href && href.startsWith("/")) {
      return (
        <Link
          className={className || undefined}
          href={href}
          target={target || undefined}
          rel={rel || undefined}
        >
          {domToReact(node.children as DOMNode[])}
        </Link>
      );
    }
  }
  return undefined;
};

export const getTransformedHtml = (
  html: string | null | undefined
): React.ReactNode => {
  if (!html) return null;
  return <>{parse(html.toString(), { replace: HtmlReactParserReplace })}</>;
};
