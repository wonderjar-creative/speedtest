import { Maybe } from '@/gql/graphql';
import { htmlToDOM, DOMNode, Element } from 'html-react-parser';

const getDynamicMediaItem = (dynamicContent: Maybe<string> | undefined) => {
  if (!dynamicContent) return null;

  const dom = htmlToDOM(dynamicContent) as DOMNode[];

  // Find the first img element in the parsed DOM
  const findImgElement = (nodes: DOMNode[]): Element | null => {
    for (const node of nodes) {
      if (node.type === 'tag' && node.name === 'img') {
        return node as Element;
      }
      if (node.type === 'tag' && node.children) {
        const found = findImgElement(node.children as DOMNode[]);
        if (found) return found;
      }
    }
    return null;
  };

  const mediaItem = findImgElement(dom);

  if (mediaItem && mediaItem.attribs) {
    return {
      node: {
        sourceUrl: mediaItem.attribs.src || undefined,
        altText: mediaItem.attribs.alt || undefined,
        mediaDetails: {
          width: mediaItem.attribs.width ? parseInt(mediaItem.attribs.width || '0', 10) : undefined,
          height: mediaItem.attribs.height ? parseInt(mediaItem.attribs.height || '0', 10) : undefined,
          sizes: undefined,
        },
      },
    };
  }
  return null;
};

export default getDynamicMediaItem;
