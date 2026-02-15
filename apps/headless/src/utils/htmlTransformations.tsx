import Link from 'next/link';
import parse, { domToReact, DOMNode } from 'html-react-parser';
import { Maybe } from '@/gql/graphql';

export const stripOuterTag = (
  html: string,
  tagToStrip: string = 'div'
): string => {
  return html.replace(new RegExp(`<${tagToStrip}[^>]*>(.*)<\\/${tagToStrip}>`, 's'), '$1');
}

type HtmlReactParserReplaceType = string | boolean | void | object | Element | null;

const HtmlReactParserReplace = (node: DOMNode): HtmlReactParserReplaceType => {
  if (node.type === 'tag' && node.name === 'a') {
    const { class: className, href, target, rel } = node.attribs;
    // Check if it's an internal link
    if (href && href.startsWith('/')) {
      return (
        <Link className={`${className} is-next-link _transformed`} href={href} target={target} rel={rel}>
          {domToReact(node.children as DOMNode[])}
        </Link>
      );
    }
  }
  return null;
};

export const getTransformedHtml = (
   html: string | Element | Element[] | Maybe<string> | undefined
): React.ReactNode => {
  if (!html) return;
  return <>{parse(html.toString(), { replace: HtmlReactParserReplace })}</>;
};
