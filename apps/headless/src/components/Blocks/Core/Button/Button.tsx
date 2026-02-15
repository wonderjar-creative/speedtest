import Link from 'next/link';
import { FrontendBlock } from '@/types/coreBlockTypes';
import { CoreButtonBlockAttributes } from '@/gql/graphql';
import { getBlockBaseClass, getBlockClasses, getBlockStyleAttr } from '@/utils/blockStyles';
import { stripOuterTag, getTransformedHtml } from '@/utils/htmlTransformations';

export interface CoreButtonBlock extends FrontendBlock {
  attributes?: CoreButtonBlockAttributes;
}

const Button: React.FC<CoreButtonBlock> = ({ name, attributes, saveContent }) => {
  const { anchor, className, linkTarget, rel, style, url } = attributes || {};
  const blockClasses = getBlockClasses({}, getBlockBaseClass(name));
  const blockStyleAttr = getBlockStyleAttr(style);
  const linkClasses = getBlockClasses(attributes || {}, 'wp-block-button__link');
  const content = saveContent || '';
  const strippedDiv = stripOuterTag(content, 'div');
  const strippedA = stripOuterTag(strippedDiv, 'a');

  return (
    <div
      {...(anchor && { id: anchor })}
      className={blockClasses}
      {...(style && { style: blockStyleAttr })}
    >
      {url && (url.startsWith('/') || (process.env.NEXT_PUBLIC_BASE_URL && url.startsWith(process.env.NEXT_PUBLIC_BASE_URL))) ? (
        <Link
          className={`${linkClasses} is-next-link _direct`}
          href={url}
          {...(linkTarget && { target: linkTarget })}
          {...(rel && { rel })}
        >
          {getTransformedHtml(strippedA || '')}
        </Link>
      ) : (
        getTransformedHtml(strippedDiv || '')
      )}
    </div>
  );
};

export default Button;
