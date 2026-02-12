import Link from "next/link";
import type { FrontendBlock } from "@/types/blocks";
import {
  getBlockBaseClass,
  getBlockClasses,
  getBlockStyleAttr,
} from "@/utils/blockStyles";
import { stripOuterTag, getTransformedHtml } from "@/utils/htmlTransformations";

const Button: React.FC<FrontendBlock> = ({ name, attributes, saveContent }) => {
  const { anchor, style, url, linkTarget, rel } = attributes || {};
  const blockClasses = getBlockClasses({}, getBlockBaseClass(name));
  const blockStyleAttr = getBlockStyleAttr(style);
  const linkClasses = getBlockClasses(
    attributes || {},
    "wp-block-button__link"
  );
  const content = saveContent || "";
  const strippedDiv = stripOuterTag(content, "div");
  const strippedA = stripOuterTag(strippedDiv, "a");

  const isInternal =
    url &&
    (url.startsWith("/") ||
      (process.env.NEXT_PUBLIC_BASE_URL &&
        url.startsWith(process.env.NEXT_PUBLIC_BASE_URL)));

  return (
    <div
      {...(anchor && { id: anchor })}
      className={blockClasses}
      {...(style && { style: blockStyleAttr })}
    >
      {isInternal ? (
        <Link
          className={linkClasses}
          href={url}
          {...(linkTarget && { target: linkTarget })}
          {...(rel && { rel })}
        >
          {getTransformedHtml(strippedA || "")}
        </Link>
      ) : (
        getTransformedHtml(strippedDiv || "")
      )}
    </div>
  );
};

export default Button;
